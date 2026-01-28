import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export interface Enrollment {
  id: string;
  enrolledAt: Date;

  User: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };

  Course: {
    id: string;
    title: string;
    slug: string;
    price: number;
    type: string;
    instructorName: string | null;
  };
}

export interface GetEnrollmentsResponse {
  success: boolean;
  data: Enrollment[];
  totalEnrollments: number;
}


export async function GET() {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        Course: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            type: true,
            // instructorName: true,
          },
        },
      },
      orderBy: {
        enrolledAt: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: enrollments,
        totalEnrollments: enrollments.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET ENROLLMENTS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch enrollments" },
      { status: 500 }
    );
  }
}
