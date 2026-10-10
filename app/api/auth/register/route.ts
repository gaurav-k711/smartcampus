import { NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { NotificationType, Role } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Zod schema validation
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, password, role, department } = validationResult.data;
    const normalizedEmail = email.trim().toLowerCase();

    // 2. Security constraint: Block self-assignment of ADMIN role
    if ((role as string) === "ADMIN") {
      return NextResponse.json(
        { error: "Administrative accounts cannot be self-registered." },
        { status: 403 }
      );
    }

    // 3. Check for existing user with identical email
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this campus email already exists." },
        { status: 409 }
      );
    }

    // 4. Secure password hashing (10 salt rounds)
    const passwordHash = await bcrypt.hash(password, 10);

    // 5. Create new User record
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role,
        department: department.trim(),
      },
    });

    // 6. Create welcome notification
    await prisma.notification.create({
      data: {
        userId: newUser.id,
        title: "Welcome to SmartCampus!",
        message: `Your ${role.toLowerCase()} account has been verified. You can now explore resources and book facilities.`,
        type: NotificationType.SUCCESS,
        read: false,
      },
    });

    return NextResponse.json(
      {
        message: "Account registered successfully",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          department: newUser.department,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while creating your account." },
      { status: 500 }
    );
  }
}
