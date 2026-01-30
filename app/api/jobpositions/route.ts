import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUserId } from "@/utility/currentSession";
import { EmploymentType, JobPosition } from "@prisma/client";

// Custom type for JobPosition with relations
export type JobPositionWithRelations = JobPosition & {
  applications: Array<{
    id: string;
    status: string;
  }>;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
};

// api to create a job postion, only admin can create course
export async function POST(req: NextRequest) {
  try {
    const userId: string | null = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user to check role
    const user = await prisma.user.findUnique({
      where: { id: userId ?? undefined },
    });

    if (user?.role === "STUDENT") {
      return NextResponse.json(
        { error: "You are not allowed to create job positions" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      department,
      location,
      employmentType,
      experienceRequired,
      salaryRange,
      isActive,
    } = body;

    // Basic validation
    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 },
      );
    }

    const job = await prisma.jobPosition.create({
      data: {
        title,
        description,
        department: department || null,
        location: location || null,
        employmentType: employmentType || EmploymentType.FULL_TIME,
        experienceRequired: parseInt(experienceRequired) || null,
        salaryRange: salaryRange || null,
        isActive: isActive ?? true,
        createdById: userId,
      },
    });

    return NextResponse.json({ success: true, data: job }, { status: 201 });
  } catch (error) {
    console.error("CREATE JOB POSITION ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create job position" },
      { status: 500 },
    );
  }
}
// api to get all job postions
export async function GET() {
  try {
    const jobPositions = await prisma.jobPosition.findMany({
      include: {
        applications: {
          select: {
            id: true,
            status: true,
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json({ success: true, data: jobPositions }, { status: 200 });
  } catch (error) {
    console.error("Error in fetching job postions:", error);
    return NextResponse.json(
      { error: "error to fetch job positions" },
      { status: 500 },
    );
  }
}
