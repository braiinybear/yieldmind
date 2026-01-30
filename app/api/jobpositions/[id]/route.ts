import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUserId } from "@/utility/currentSession";
import { EmploymentType } from "@prisma/client";

// GET - Fetch a specific job position by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const jobPosition = await prisma.jobPosition.findUnique({
      where: { id },
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
      }
    });

    if (!jobPosition) {
      return NextResponse.json(
        { error: "Job position not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: jobPosition },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET JOB POSITION ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch job position" },
      { status: 500 }
    );
  }
}

// PUT - Update a specific job position by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId: string | null = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user to check role
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.role === "STUDENT") {
      return NextResponse.json(
        { error: "You are not allowed to update job positions" },
        { status: 403 }
      );
    }

    // Check if job position exists and if user has permission to update it
    const existingJob = await prisma.jobPosition.findUnique({
      where: { id },
    });

    if (!existingJob) {
      return NextResponse.json(
        { error: "Job position not found" },
        { status: 404 }
      );
    }

    // Only allow the creator or admin to update
    if (user?.role !== "ADMIN" && existingJob.createdById !== userId) {
      return NextResponse.json(
        { error: "You don't have permission to update this job position" },
        { status: 403 }
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
        { status: 400 }
      );
    }

    const updatedJob = await prisma.jobPosition.update({
      where: { id },
      data: {
        title,
        description,
        department: department || null,
        location: location || null,
        employmentType: employmentType || EmploymentType.FULL_TIME,
        experienceRequired: experienceRequired || null,
        salaryRange: salaryRange || null,
        isActive: isActive ?? true,
      },
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
      }
    });

    return NextResponse.json(
      { success: true, data: updatedJob },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE JOB POSITION ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update job position" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific job position by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId: string | null = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user to check role
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.role === "STUDENT") {
      return NextResponse.json(
        { error: "You are not allowed to delete job positions" },
        { status: 403 }
      );
    }

    // Check if job position exists and if user has permission to delete it
    const existingJob = await prisma.jobPosition.findUnique({
      where: { id },
    });

    if (!existingJob) {
      return NextResponse.json(
        { error: "Job position not found" },
        { status: 404 }
      );
    }

    // Only allow the creator or admin to delete
    if (user?.role !== "ADMIN" && existingJob.createdById !== userId) {
      return NextResponse.json(
        { error: "You don't have permission to delete this job position" },
        { status: 403 }
      );
    }

    await prisma.jobPosition.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Job position deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE JOB POSITION ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete job position" },
      { status: 500 }
    );
  }
}
