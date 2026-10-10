import prisma from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictingBooking?: {
    id: string;
    startTime: string;
    endTime: string;
    purpose: string;
    status: BookingStatus;
  };
}

/**
 * Checks if a proposed booking interval [startTime, endTime) overlaps with any
 * existing APPROVED or PENDING bookings for the same resource on the given date.
 *
 * Mathematical Interval Overlap Condition:
 * An existing interval [S_exist, E_exist) overlaps with [S_new, E_new) if and only if:
 * S_new < E_exist AND E_new > S_exist
 *
 * Adjacent bookings are explicitly permitted (e.g. 10:00-12:00 and 12:00-14:00 do not overlap).
 */
export async function checkBookingConflict(
  resourceId: string,
  date: string,
  startTime: string,
  endTime: string,
  excludeBookingId?: string
): Promise<ConflictCheckResult> {
  // 1. Fetch all active bookings for this resource and date
  const existingBookings = await prisma.booking.findMany({
    where: {
      resourceId,
      date,
      status: {
        in: [BookingStatus.APPROVED, BookingStatus.PENDING],
      },
      ...(excludeBookingId ? { id: { not: excludeBookingId } } : {}),
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      purpose: true,
      status: true,
    },
  });

  // 2. Evaluate interval overlaps
  for (const existing of existingBookings) {
    const isOverlapping =
      startTime < existing.endTime && endTime > existing.startTime;

    if (isOverlapping) {
      return {
        hasConflict: true,
        conflictingBooking: existing,
      };
    }
  }

  return { hasConflict: false };
}
