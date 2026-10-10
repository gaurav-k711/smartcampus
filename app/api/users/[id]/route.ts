import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.ADMIN) {
      return NextResponse.json(
        { error: "Forbidden: Administrator privileges required." },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { role, department } = body;

    // Safety rule: Admin cannot remove their own admin access
    if (session.user.id === id && role && role !== Role.ADMIN) {
      return NextResponse.json(
        { error: "Security restriction: You cannot demote your own administrator account." },
        { status: 400 }
      );
    }

    const dataToUpdate: any = {};
    if (role && Object.values(Role).includes(role)) {
      dataToUpdate.role = role;
    }
    if (department && typeof department === "string") {
      dataToUpdate.department = department.trim();
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "User account updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("User PATCH [id] error:", error);
    return NextResponse.json(
      { error: "Failed to update user account" },
      { status: 500 }
    );
  }
}
