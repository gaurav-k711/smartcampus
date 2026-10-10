import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { resourceSchema } from "@/lib/validations/resource";
import { ResourceStatus, Role } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const status = searchParams.get("status")?.trim() as ResourceStatus | null;
    const minCapacity = searchParams.get("minCapacity");
    const location = searchParams.get("location")?.trim() || "";

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = {
        name: { equals: category, mode: "insensitive" },
      };
    }

    if (status && Object.values(ResourceStatus).includes(status)) {
      where.status = status;
    }

    if (minCapacity && !isNaN(Number(minCapacity))) {
      where.capacity = { gte: Number(minCapacity) };
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    const resources = await prisma.resource.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(
      { resources },
      {
        headers: {
          // Serve fresh for 30s, then serve stale while revalidating in background
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );

  } catch (error) {
    console.error("Resources GET error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve resources" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.ADMIN) {
      return NextResponse.json(
        { error: "Forbidden: Administrator privileges required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = resourceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    const newResource = await prisma.resource.create({
      data: {
        name: data.name.trim(),
        categoryId: data.categoryId,
        description: data.description.trim(),
        location: data.location.trim(),
        capacity: data.capacity,
        status: data.status,
        requiresApproval: data.requiresApproval,
        imageUrl: data.imageUrl || null,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(
      { message: "Resource created successfully", resource: newResource },
      { status: 201 }
    );
  } catch (error) {
    console.error("Resource creation error:", error);
    return NextResponse.json(
      { error: "Failed to create campus resource" },
      { status: 500 }
    );
  }
}
