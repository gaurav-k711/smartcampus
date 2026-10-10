import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.resourceCategory.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { resources: true },
        },
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Categories fetch error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve resource categories" },
      { status: 500 }
    );
  }
}
