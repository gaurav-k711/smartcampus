import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createBookingSchema } from "@/lib/validations/booking";
import { checkBookingConflict } from "@/lib/services/conflictEngine";
import { BookingStatus, NotificationType, ResourceStatus, Role } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as BookingStatus | null;
    const resourceId = searchParams.get("resourceId");
    const date = searchParams.get("date");

    const where: any = {};

    // Role-based visibility isolation
    if (session.user.role !== Role.ADMIN) {
      // Non-admins can only see their own bookings
      where.userId = session.user.id;
    } else {
      // Admin can filter by specific user if provided
      const filterUserId = searchParams.get("userId");
      if (filterUserId) where.userId = filterUserId;
    }

    if (status && Object.values(BookingStatus).includes(status)) {
      where.status = status;
    }

    if (resourceId) {
      where.resourceId = resourceId;
    }

    if (date) {
      where.date = date;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        resource: {
          include: { category: true },
        },
        user: {
          select: { id: true, name: true, email: true, department: true, role: true },
        },
      },
      orderBy: [{ date: "desc" }, { startTime: "asc" }],
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Bookings GET error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve reservations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in to create a booking." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = createBookingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { resourceId, date, startTime, endTime, purpose } = validation.data;

    // 1. Fetch resource and verify operational availability
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      return NextResponse.json(
        { error: "Selected campus resource not found." },
        { status: 404 }
      );
    }

    if (resource.status !== ResourceStatus.AVAILABLE) {
      return NextResponse.json(
        {
          error: `Cannot book this resource. Operational status is currently '${resource.status}'.`,
        },
        { status: 400 }
      );
    }

    // 2. Strict Server-Side Overlap Conflict Detection
    const conflictResult = await checkBookingConflict(
      resourceId,
      date,
      startTime,
      endTime
    );

    if (conflictResult.hasConflict) {
      const existing = conflictResult.conflictingBooking!;
      return NextResponse.json(
        {
          error: `Booking Conflict: The requested slot overlaps with an existing reservation (${existing.startTime} - ${existing.endTime}). Please choose an alternate window.`,
          conflictDetails: existing,
        },
        { status: 409 }
      );
    }

    // 3. Determine Approval Status
    const initialStatus = resource.requiresApproval
      ? BookingStatus.PENDING
      : BookingStatus.APPROVED;

    // 4. Create Booking record
    const newBooking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        resourceId,
        date,
        startTime,
        endTime,
        purpose: purpose.trim(),
        status: initialStatus,
      },
      include: {
        resource: { include: { category: true } },
      },
    });

    // 5. Dispatch User In-App Notification
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        title:
          initialStatus === BookingStatus.APPROVED
            ? "Booking Confirmed"
            : "Booking Submitted for Review",
        message:
          initialStatus === BookingStatus.APPROVED
            ? `Your reservation for ${resource.name} on ${date} (${startTime} - ${endTime}) is confirmed.`
            : `Your request for ${resource.name} on ${date} (${startTime} - ${endTime}) is pending administrator approval.`,
        type:
          initialStatus === BookingStatus.APPROVED
            ? NotificationType.SUCCESS
            : NotificationType.INFO,
        read: false,
      },
    });

    // 6. If requires approval, notify administrators
    if (initialStatus === BookingStatus.PENDING) {
      const admins = await prisma.user.findMany({
        where: { role: Role.ADMIN },
        select: { id: true },
      });

      for (const admin of admins) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            title: "New Approval Request",
            message: `${session.user.name} requested ${resource.name} for ${date} (${startTime} - ${endTime}).`,
            type: NotificationType.ALERT,
            read: false,
          },
        });
      }
    }

    return NextResponse.json(
      {
        message:
          initialStatus === BookingStatus.APPROVED
            ? "Reservation confirmed successfully."
            : "Reservation request submitted for administrator approval.",
        booking: newBooking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking POST error:", error);
    return NextResponse.json(
      { error: "Failed to create booking reservation." },
      { status: 500 }
    );
  }
}
