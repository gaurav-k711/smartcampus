import prisma from "@/lib/prisma";
import AnalyticsDashboardClient from "@/components/admin/AnalyticsDashboardClient";
import { BarChart3 } from "lucide-react";

// Analytics are lagging indicators — 60-second cache is appropriate
export const revalidate = 60;


export default async function AdminAnalyticsPage() {
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

  // Rolling past 7 days
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

  // Category distribution
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

  // Peak Hours distribution
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

  // Top Resources
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

  const activeRounds = approvedBookings + pendingBookings;
  const campusUtilizationRate = Math.min(
    Math.round((activeRounds / (totalResources * 5 || 1)) * 100),
    94
  );

  const analyticsData = {
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
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Resource Utilization Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time data visualization of campus reservations, category distributions, and hourly demand peaks.
          </p>
        </div>
      </div>

      <AnalyticsDashboardClient data={analyticsData} />
    </div>
  );
}
