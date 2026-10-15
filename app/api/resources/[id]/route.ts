import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { resourceSchema } from "@/lib/validations/resource";
import { Role } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const resource = await prisma.resource.findUnique({
      where: { id },
      include: {
        category: true,
        predictions: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    // Fetch today's schedule for this resource
    const todayISO = new Date().toISOString().split("T")[0];
    const todayBookings = await prisma.booking.findMany({
      where: {
        resourceId: id,
        date: todayISO,
        status: { in: ["APPROVED", "PENDING"] },
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        purpose: true,
        status: true,
        user: {
          select: { name: true, department: true },
        },
      },
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json({
      resource,
      todaySchedule: todayBookings,
    });
  } catch (error) {
    console.error("Resource GET [id] error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve resource details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.ADMIN) {
      return NextResponse.json(
        { error: "Forbidden: Administrator privileges required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const validation = resourceSchema.partial().safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const updatedResource = await prisma.resource.update({
      where: { id },
      data: validation.data,
      include: { category: true },
    });

    return NextResponse.json({
      message: "Resource updated successfully",
      resource: updatedResource,
    });
  } catch (error) {
    console.error("Resource PATCH [id] error:", error);
    return NextResponse.json(
      { error: "Failed to update resource" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.ADMIN) {
      return NextResponse.json(
        { error: "Forbidden: Administrator privileges required." },
        { status: 403 }
      );
    }

    const { id } = await params;

    await prisma.resource.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Resource deleted successfully",
    });
  } catch (error) {
    console.error("Resource DELETE [id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete resource" },
      { status: 500 }
    );
  }
}
