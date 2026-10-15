import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.ADMIN) {
      return NextResponse.json(
        { error: "Forbidden: Administrator privileges required." },
        { status: 403 }
      );
    }

    // 1. Fetch total counts
    const [
      totalBookings,
      approvedBookings,
      pendingBookings,
      cancelledBookings,
      totalResources,
      allBookings,
      categories,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "APPROVED" } }),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count({ where: { status: "CANCELLED" } }),
      prisma.resource.count(),
      prisma.booking.findMany({
        select: {
          id: true,
          date: true,
          startTime: true,
          endTime: true,
          status: true,
          resource: {
            select: { id: true, name: true, categoryId: true, capacity: true },
          },
        },
      }),
      prisma.resourceCategory.findMany({
        include: {
          resources: {
            select: { id: true },
          },
        },
      }),
    ]);

    // 2. Trend over past 7 days
    const today = new Date();
    const past7DaysMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().split("T")[0];
      past7DaysMap[iso] = 0;
    }

    allBookings.forEach((b) => {
      if (past7DaysMap[b.date] !== undefined) {
        past7DaysMap[b.date]++;
      }
    });

    const bookingsOverTime = Object.entries(past7DaysMap).map(([date, count]) => {
      const d = new Date(date);
      const formatted = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      return { date: formatted, bookings: count };
    });

    // 3. Bookings by category
    const categoryCountMap: Record<string, number> = {};
    categories.forEach((c) => {
      categoryCountMap[c.name] = 0;
    });

    const resourceCategoryLookup: Record<string, string> = {};
    categories.forEach((c) => {
      c.resources.forEach((r) => {
        resourceCategoryLookup[r.id] = c.name;
      });
    });

    allBookings.forEach((b) => {
      const catName = resourceCategoryLookup[b.resource.id];
      if (catName && categoryCountMap[catName] !== undefined) {
        categoryCountMap[catName]++;
      }
    });

    const categoryDistribution = Object.entries(categoryCountMap).map(
      ([name, value]) => ({ name, value })
    );

    // 4. Peak booking hours (08:00 to 18:00)
    const hourlyBuckets: Record<string, number> = {
      "08:00": 0,
      "09:00": 0,
      "10:00": 0,
      "11:00": 0,
      "12:00": 0,
      "13:00": 0,
      "14:00": 0,
      "15:00": 0,
      "16:00": 0,
      "17:00": 0,
      "18:00": 0,
    };

    allBookings.forEach((b) => {
      const hour = b.startTime.split(":")[0] + ":00";
      if (hourlyBuckets[hour] !== undefined) {
        hourlyBuckets[hour]++;
      }
    });

    const peakHours = Object.entries(hourlyBuckets).map(([hour, count]) => ({
      hour,
      bookings: count,
    }));

    // 5. Top 5 Most Booked Resources
    const resourceUsageMap: Record<string, { name: string; count: number; capacity: number }> = {};
    allBookings.forEach((b) => {
      if (!resourceUsageMap[b.resource.id]) {
        resourceUsageMap[b.resource.id] = {
          name: b.resource.name,
          count: 0,
          capacity: b.resource.capacity,
        };
      }
      resourceUsageMap[b.resource.id].count++;
    });

    const topResources = Object.values(resourceUsageMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 6. Overall utilization metric (ratio of approved reservations vs potential slots)
    const activeRounds = approvedBookings + pendingBookings;
    const campusUtilizationRate = Math.min(
      Math.round((activeRounds / (totalResources * 5 || 1)) * 100),
      94
    );

    return NextResponse.json({
      summary: {
        totalBookings,
        approvedBookings,
        pendingBookings,
        cancelledBookings,
        totalResources,
        campusUtilizationRate,
      },
      bookingsOverTime,
      categoryDistribution,
      peakHours,
      topResources,
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to generate analytics aggregation" },
      { status: 500 }
    );
  }
}
