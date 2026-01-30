import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUserId } from "@/utility/currentSession";
import { ApplicationStatus } from "@prisma/client";

// POST - Create job application (apply for job)
export async function POST(req: NextRequest) {
  try {
    const userId: string | null = "0f6373fb-a515-45c5-aa1f-7bb06d17a5c2";

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user to check role - only students can apply
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Only students can apply for job positions" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const {
      jobId,
      fullName,
      email,
      phone,
      qualification,
      experience,
      skills,
      resumeUrl,
      coverLetter,
    } = body;

    // Basic validation
    if (
      !jobId ||
      !fullName ||
      !email ||
      !phone ||
      !qualification ||
      !resumeUrl
    ) {
      return NextResponse.json(
        {
          error:
            "Required fields: jobId, fullName, email, phone, qualification, resumeUrl",
        },
        { status: 400 },
      );
    }

    // Check if job position exists and is active
    const jobPosition = await prisma.jobPosition.findUnique({
      where: { id: jobId },
    });

    if (!jobPosition) {
      return NextResponse.json(
        { error: "Job position not found" },
        { status: 404 },
      );
    }

    if (!jobPosition.isActive) {
      return NextResponse.json(
        { error: "This job position is no longer accepting applications" },
        { status: 400 },
      );
    }

    // Check if user has already applied for this job
    const existingApplication = await prisma.jobApplication.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied for this position" },
        { status: 400 },
      );
    }

    // Create job application
    const jobApplication = await prisma.jobApplication.create({
      data: {
        userId,
        jobId,
        fullName,
        email,
        phone,
        qualification,
        experience: parseInt(experience) || null,
        skills: skills || [],
        resumeUrl,
        coverLetter: coverLetter || null,
        status: ApplicationStatus.APPLIED,
      },
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
      { success: true, data: jobApplication },
      { status: 201 },
    );
  } catch (error) {
    console.error("CREATE JOB APPLICATION ERROR:", error);
    return NextResponse.json(
      { error: "Failed to submit job application" },
      { status: 500 },
    );
  }
}

// GET - Fetch job applications based on user role
export async function GET(req: NextRequest) {
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

    const url = new URL(req.url);
    const jobId = url.searchParams.get("jobId");
    const status = url.searchParams.get("status") as ApplicationStatus;

    const whereClause: {
      userId?: string;
      JobPosition?: {
        createdById: string;
      };
      jobId?: string;
      status?: ApplicationStatus;
    } = {};

    // Role-based access control
    if (user.role === "STUDENT") {
      // Students see only their own applications
      whereClause.userId = userId;
    } else if (user.role === "EMPLOYEE") {
      // Employees see applications for jobs they created
      whereClause.JobPosition = {
        createdById: userId,
      };
    }
    // Admins see all applications (no additional filtering)

    // Optional filters
    if (jobId) {
      whereClause.jobId = jobId;
    }
    if (status) {
      whereClause.status = status;
    }

    const jobApplications = await prisma.jobApplication.findMany({
      where: whereClause,
      include: {
        JobPosition: {
          select: {
            id: true,
            title: true,
            department: true,
            location: true,
            employmentType: true,
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
      orderBy: {
        appliedAt: "desc",
      },
    });

    return NextResponse.json(
      { success: true, data: jobApplications },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET JOB APPLICATIONS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch job applications" },
      { status: 500 },
    );
  }
}

// PUT - Update application status (Admin/Employee only)
export async function PUT(req: NextRequest) {
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

    const body = await req.json();
    const { applicationId, status } = body;

    if (!applicationId || !status) {
      return NextResponse.json(
        { error: "Application ID and status are required" },
        { status: 400 },
      );
    }

    // Validate status
    const validStatuses = Object.values(ApplicationStatus);
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Get application to check permissions
    const application = await prisma.jobApplication.findUnique({
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
    const updatedApplication = await prisma.jobApplication.update({
      where: { id: applicationId },
      data: { status },
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
      { success: true, data: updatedApplication },
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
