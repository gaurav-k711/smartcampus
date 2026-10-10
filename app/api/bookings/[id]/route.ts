import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { updateBookingStatusSchema } from "@/lib/validations/booking";
import { BookingStatus, NotificationType, Role } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        resource: { include: { category: true } },
        user: { select: { id: true, name: true, email: true, department: true } },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Role check: Only owner or admin can view
    if (session.user.role !== Role.ADMIN && booking.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden access." }, { status: 403 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Booking GET [id] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    const validation = updateBookingStatusSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { status, rejectionReason } = validation.data;

    // Fetch existing booking
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { resource: true, user: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Handle user cancellation
    if (status === "CANCELLED") {
      const isOwner = booking.userId === session.user.id;
      const isAdmin = session.user.role === Role.ADMIN;

      if (!isOwner && !isAdmin) {
        return NextResponse.json(
          { error: "Forbidden: You cannot cancel another user's reservation." },
          { status: 403 }
        );
      }

      if (booking.status === BookingStatus.COMPLETED) {
        return NextResponse.json(
          { error: "Completed bookings cannot be cancelled." },
          { status: 400 }
        );
      }

      if (booking.status === BookingStatus.CANCELLED) {
        return NextResponse.json(
          { error: "Booking is already cancelled." },
          { status: 400 }
        );
      }

      const updated = await prisma.booking.update({
        where: { id },
        data: { status: BookingStatus.CANCELLED },
      });

      // Notification
      await prisma.notification.create({
        data: {
          userId: booking.userId,
          title: "Reservation Cancelled",
          message: `Your booking for ${booking.resource.name} on ${booking.date} (${booking.startTime}-${booking.endTime}) has been cancelled.`,
          type: NotificationType.WARNING,
          read: false,
        },
      });

      return NextResponse.json({
        message: "Reservation successfully cancelled.",
        booking: updated,
      });
    }

    // Administrative approval / rejection
    if (status === "APPROVED" || status === "REJECTED") {
      if (session.user.role !== Role.ADMIN) {
        return NextResponse.json(
          { error: "Forbidden: Only administrators can approve or reject bookings." },
          { status: 403 }
        );
      }

      if (status === "REJECTED" && !rejectionReason?.trim()) {
        return NextResponse.json(
          { error: "A rejection reason is required when declining a reservation." },
          { status: 400 }
        );
      }

      const updated = await prisma.booking.update({
        where: { id },
        data: {
          status: status as BookingStatus,
          rejectionReason: status === "REJECTED" ? rejectionReason?.trim() : null,
        },
      });

      // Send alert notification to the user
      await prisma.notification.create({
        data: {
          userId: booking.userId,
          title:
            status === "APPROVED"
              ? "Reservation Approved!"
              : "Reservation Request Declined",
          message:
            status === "APPROVED"
              ? `Your booking for ${booking.resource.name} on ${booking.date} (${booking.startTime} - ${booking.endTime}) has been approved.`
              : `Your booking request for ${booking.resource.name} was rejected. Reason: ${rejectionReason}`,
          type:
            status === "APPROVED"
              ? NotificationType.SUCCESS
              : NotificationType.ALERT,
          read: false,
        },
      });

      return NextResponse.json({
        message: `Booking has been ${status.toLowerCase()} successfully.`,
        booking: updated,
      });
    }

    return NextResponse.json({ error: "Invalid status action." }, { status: 400 });
  } catch (error) {
    console.error("Booking PATCH [id] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
