import prisma from "@/lib/prisma";
import { DemandLevel } from "@prisma/client";

export interface PredictionResult {
  demandScore: number;
  demandLevel: DemandLevel;
  confidence: number;
  explanation: string;
  historicalBookingCount: number;
}

/**
 * Explainable Historical Demand Forecasting Service
 *
 * Evaluates historical reservations for a given facility, matching:
 * 1. Matching day of the week (e.g. all previous Mondays)
 * 2. Overlapping timeslot booking density
 * 3. Recent 30-day booking volume
 *
 * Yields a deterministic 0-100 score, classification, and statistical confidence.
 */
export async function predictResourceDemand(
  resourceId: string,
  targetDate: string,
  timeSlot: string = "10:00-12:00"
): Promise<PredictionResult> {
  const [slotStart, slotEnd] = timeSlot.includes("-")
    ? timeSlot.split("-")
    : ["10:00", "12:00"];

  // 1. Determine day of week
  const dateObj = new Date(targetDate);
  const targetDayOfWeek = dateObj.getDay(); // 0 is Sunday, 1 is Monday, etc.

  // 2. Fetch past bookings for this resource
  const pastBookings = await prisma.booking.findMany({
    where: {
      resourceId,
      status: { in: ["APPROVED", "COMPLETED"] },
    },
    select: {
      date: true,
      startTime: true,
      endTime: true,
    },
  });

  const totalHistorical = pastBookings.length;

  if (totalHistorical === 0) {
    return {
      demandScore: 15,
      demandLevel: DemandLevel.LOW,
      confidence: 70,
      explanation: "Low predicted demand. No prior congestion recorded for this facility.",
      historicalBookingCount: 0,
    };
  }

  // 3. Count bookings on same day of week
  let sameDayOfWeekCount = 0;
  let overlappingSlotCount = 0;

  for (const b of pastBookings) {
    const bDate = new Date(b.date);
    if (bDate.getDay() === targetDayOfWeek) {
      sameDayOfWeekCount++;
    }

    // Check if historical booking overlapped with requested time slot
    if (slotStart < b.endTime && slotEnd > b.startTime) {
      overlappingSlotCount++;
    }
  }

  // 4. Calculate weighted demand score (0-100)
  // Weight 1: Timeslot overlap frequency (60%)
  // Weight 2: Day of week tendency (25%)
  // Weight 3: Overall facility popularity (15%)
  const slotFactor = Math.min(overlappingSlotCount / 4, 1.0) * 60;
  const dayFactor = Math.min(sameDayOfWeekCount / 5, 1.0) * 25;
  const volumeFactor = Math.min(totalHistorical / 10, 1.0) * 15;

  const rawScore = Math.round(slotFactor + dayFactor + volumeFactor);
  const demandScore = Math.max(10, Math.min(rawScore, 98));

  // 5. Classify level
  let demandLevel: DemandLevel;
  if (demandScore <= 35) {
    demandLevel = DemandLevel.LOW;
  } else if (demandScore <= 70) {
    demandLevel = DemandLevel.MEDIUM;
  } else {
    demandLevel = DemandLevel.HIGH;
  }

  // 6. Calculate confidence based on sample size
  const confidence = Math.min(65 + totalHistorical * 3, 96);

  // 7. Human-readable explanation
  let explanation = "";
  if (demandLevel === DemandLevel.HIGH) {
    explanation = `Demand is high because the ${slotStart}-${slotEnd} slot has historically received ${overlappingSlotCount} reservations, with high day-of-week traffic.`;
  } else if (demandLevel === DemandLevel.MEDIUM) {
    explanation = `Moderate utilization expected. Historical records indicate occasional reservations during this window.`;
  } else {
    explanation = `Light traffic anticipated. Open availability historically observed for this time slot.`;
  }

  return {
    demandScore,
    demandLevel,
    confidence,
    explanation,
    historicalBookingCount: totalHistorical,
  };
}
