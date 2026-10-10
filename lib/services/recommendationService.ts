import prisma from "@/lib/prisma";
import { ResourceStatus, DemandLevel } from "@prisma/client";
import { predictResourceDemand } from "./demandForecaster";
import { checkBookingConflict } from "./conflictEngine";

export interface AlternativeRecommendation {
  resource: {
    id: string;
    name: string;
    location: string;
    capacity: number;
    requiresApproval: boolean;
    category: { name: string };
  };
  demandScore: number;
  demandLevel: DemandLevel;
  recommendationScore: number;
  reason: string;
}

/**
 * Smart Alternative Facility Recommendation Engine
 *
 * Discovers available, low-congestion alternative resources within the same
 * category when the user's primary target is crowded or conflicted.
 */
export async function getSmartAlternatives(
  targetResourceId: string,
  date: string,
  timeSlot: string = "10:00-12:00"
): Promise<AlternativeRecommendation[]> {
  const [slotStart, slotEnd] = timeSlot.includes("-")
    ? timeSlot.split("-")
    : ["10:00", "12:00"];

  // 1. Fetch the target resource details
  const target = await prisma.resource.findUnique({
    where: { id: targetResourceId },
    include: { category: true },
  });

  if (!target) return [];

  // 2. Fetch candidate resources in the same category
  const candidates = await prisma.resource.findMany({
    where: {
      categoryId: target.categoryId,
      id: { not: target.id },
      status: ResourceStatus.AVAILABLE,
    },
    include: { category: true },
  });

  const scoredAlternatives: AlternativeRecommendation[] = [];

  for (const candidate of candidates) {
    // A. Check if candidate has a conflict during this specific slot
    const conflict = await checkBookingConflict(
      candidate.id,
      date,
      slotStart,
      slotEnd
    );

    if (conflict.hasConflict) {
      // Skip candidates that are already occupied
      continue;
    }

    // B. Calculate predicted demand for this candidate
    const prediction = await predictResourceDemand(
      candidate.id,
      date,
      timeSlot
    );

    // C. Calculate matching recommendation score (0-100)
    // 1. Capacity proximity (delta <= 15 is better)
    const capDiff = Math.abs(candidate.capacity - target.capacity);
    const capScore = Math.max(0, 30 - capDiff * 2);

    // 2. Location proximity (bonus if in same block/building)
    const isNearby =
      candidate.location.split(",")[0] === target.location.split(",")[0];
    const locScore = isNearby ? 30 : 15;

    // 3. Lower demand bonus (inversely proportional to demand score)
    const demandBonus = Math.round((100 - prediction.demandScore) * 0.4);

    const totalScore = capScore + locScore + demandBonus;

    let reason = "";
    if (prediction.demandLevel === DemandLevel.LOW) {
      reason = `Significantly lower congestion (${prediction.demandScore}% demand), same category, capacity for ${candidate.capacity} people.`;
    } else {
      reason = `Available during requested window with comparable seating capacity (${candidate.capacity} seats).`;
    }

    scoredAlternatives.push({
      resource: {
        id: candidate.id,
        name: candidate.name,
        location: candidate.location,
        capacity: candidate.capacity,
        requiresApproval: candidate.requiresApproval,
        category: { name: candidate.category.name },
      },
      demandScore: prediction.demandScore,
      demandLevel: prediction.demandLevel,
      recommendationScore: totalScore,
      reason,
    });
  }

  // Rank by highest recommendation score (lowest demand + best match)
  return scoredAlternatives.sort((a, b) => b.recommendationScore - a.recommendationScore);
}
