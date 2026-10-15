import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { predictResourceDemand } from "@/lib/services/demandForecaster";
import { getSmartAlternatives } from "@/lib/services/recommendationService";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const resourceId = searchParams.get("resourceId");
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
    const timeSlot = searchParams.get("timeSlot") || "10:00-12:00";

    // 1. Single resource query with alternatives
    if (resourceId) {
      const prediction = await predictResourceDemand(resourceId, date, timeSlot);
      const alternatives = await getSmartAlternatives(resourceId, date, timeSlot);

      return NextResponse.json({
        resourceId,
        date,
        timeSlot,
        prediction,
        alternatives,
      });
    }

    // 2. All resources campus-wide demand matrix
    const allResources = await prisma.resource.findMany({
      include: { category: true },
      orderBy: { name: "asc" },
    });

    const predictions = await Promise.all(
      allResources.map(async (r) => {
        const pred = await predictResourceDemand(r.id, date, timeSlot);
        return {
          resource: {
            id: r.id,
            name: r.name,
            location: r.location,
            capacity: r.capacity,
            status: r.status,
            category: r.category.name,
          },
          prediction: pred,
        };
      })
    );

    return NextResponse.json({
      date,
      timeSlot,
      predictions,
    });
  } catch (error) {
    console.error("Predictions API error:", error);
    return NextResponse.json(
      { error: "Failed to calculate demand prediction" },
      { status: 500 }
    );
  }
}
