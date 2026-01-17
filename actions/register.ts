"use server";

import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phone = formData.get("phone") as string;

  // 1. Validate data
  if (!name || !email || !password) {
    return { error: "Missing required fields" };
  }

  try {
    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email already in use!" };
    }

    // 3. Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create the User
    await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: Role.STUDENT, // Default role
      },
    });

    return { success: "Account created! Please log in." };

  } catch (error) {
    console.error("Registration Error:", error);
    return { error: "Something went wrong." };
  }
}