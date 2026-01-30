import { prisma } from "@/lib/db";
import { getCurrentUserId } from "@/utility/currentSession";
import { ApplicationStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// PUT - Update application status (Admin/Employee only)
export async function PUT(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId: string | null = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role === "STUDENT") {
      return NextResponse.json(
        { error: "Students cannot update application status" },
        { status: 403 },
      );
    }

    const { id: applicationId } = await params;

    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 },
      );
    }

    // Validate status
    const validStatuses = Object.values(ApplicationStatus);
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Get application to check permissions
    const application = await prisma.jobApplication.findFirst({
      where: { id: applicationId },
      include: {
        JobPosition: {
          select: {
            createdById: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    // Check if employee has permission to update this application
    if (
      user.role === "EMPLOYEE" &&
      application.JobPosition.createdById !== userId
    ) {
      return NextResponse.json(
        { error: "You don't have permission to update this application" },
        { status: 403 },
      );
    }

    // Update application status
    const updatedApplication = await prisma.jobApplication.updateMany({
      where: { id: applicationId },
      data: { status },
    });

    if (updatedApplication.count === 0) {
      return NextResponse.json(
        { error: "Application not found or not updated" },
        { status: 404 },
      );
    }

    // Fetch the updated application with includes
    const fetchedApplication = await prisma.jobApplication.findFirst({
      where: { id: applicationId },
      include: {
        JobPosition: {
          select: {
            id: true,
            title: true,
            department: true,
          },
        },
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, data: fetchedApplication },
      { status: 200 },
    );
  } catch (error) {
    console.error("UPDATE APPLICATION STATUS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update application status" },
      { status: 500 },
    );
  }
}

// DELETE - Delete job application (Admin/Employee only)
export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId: string | null = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role === "STUDENT") {
      return NextResponse.json(
        { error: "Students cannot delete applications" },
        { status: 403 },
      );
    }

    const { id: applicationId } = await params;

    // Get application to check permissions
    const application = await prisma.jobApplication.findFirst({
      where: { id: applicationId },
      include: {
        JobPosition: {
          select: {
            createdById: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    // Check if employee has permission to delete this application
    if (
      user.role === "EMPLOYEE" &&
      application.JobPosition.createdById !== userId
    ) {
      return NextResponse.json(
        { error: "You don't have permission to delete this application" },
        { status: 403 },
      );
    }

    // Delete application
    const deletedApplication = await prisma.jobApplication.deleteMany({
      where: { id: applicationId },
    });

    if (deletedApplication.count === 0) {
      return NextResponse.json(
        { error: "Application not found or not deleted" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Job application deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE APPLICATION ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete job application" },
      { status: 500 },
    );
  }
}