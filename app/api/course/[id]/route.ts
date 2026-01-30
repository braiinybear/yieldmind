import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import type { CourseStatus, CourseType } from "@prisma/client";
import { getCurrentUserId } from "@/utility/currentSession";

interface Lesson {
  title: string;
  description?: string;
  videoUrl?: string;
  isFree: boolean;
  order: number;
}

interface CourseUpdateData {
  title: string;
  description: string;
  thumbnail: string | null;
  price: number;
  type: CourseType;
  venue: string | null;
  shortDescription: string;
  startDate: Date | null;
  batchSize: number;
  duration: string | null;
  slug?: string;
  instructorName: string;
  instructorBio: string;
}

// What this API does:
// It returns one course with modules, lessons, and information, but:
// Students → only published courses
// Employees → only their own courses
// Admin → any course
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const userId: string | null = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId || undefined },
    });

    let whereClause: {
      id: string;
      status?: CourseStatus;
      creatorId?: string;
    } = { id };

    // Role-based access control
    if (user?.role === "STUDENT") {
      // Students can only see published courses
      whereClause = {
        id,
        status: "PUBLISHED",
      };
    } else if (user?.role === "EMPLOYEE") {
      // Employees can see courses they created
      whereClause = {
        id,
        creatorId: userId || undefined,
      };
    }
    // Admin can see all courses (no additional filtering)

    const course = await prisma.course.findUnique({
      where: whereClause,
      include: {
        modules: {
          include: {
            lessons: {
              orderBy: {
                order: "asc",
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
        information: true,
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: course }, { status: 200 });
  } catch (error) {
    console.error("GET COURSE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 },
    );
  }
}

// What this API does:
// It updates:
// Course data
// Modules
// Lessons
// Information
// And sets status depending on role.
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 },
      );
    }
    const userId: string | null = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId || undefined },
    });

    if (user?.role === "STUDENT") {
      return NextResponse.json(
        { error: "You can't update course" },
        { status: 500 },
      );
    }
    const { course, modules, information } = await req.json();

    // Fetch existing course to check if slug has changed
    const existingCourse = await prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Build update data, only including slug if it's different
    const updateData: CourseUpdateData = {
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail || null,
      price: course.price,
      type: course.type,
      shortDescription: course.shortDescription,
      instructorName: course.instructorName,
      instructorBio: course.instructorBio,
      venue: course.venue || null,
      startDate: course.startDate ? new Date(course.startDate) : null,
      batchSize: course.batchSize,
      duration: course.duration || null,
    };

    // Only update slug if it's different from existing
    if (course.slug !== existingCourse.slug) {
      updateData.slug = course.slug;
    }

    // Update the course
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: updateData,
    });

    // If modules are provided, update them
    if (modules && Array.isArray(modules)) {
      // Delete existing modules for this course
      await prisma.courseModule.deleteMany({
        where: { courseId: id },
      });

      // Create new modules
      for (const moduleData of modules) {
        const createdModule = await prisma.courseModule.create({
          data: {
            title: moduleData.title,
            order: moduleData.order,
            courseId: id,
          },
        });

        if (moduleData.lessons?.length) {
          await prisma.lesson.createMany({
            data: moduleData.lessons.map((lesson: Lesson) => ({
              title: lesson.title,
              description: lesson.description || null,
              videoUrl: lesson.videoUrl || null,
              isFree: lesson.isFree,
              order: lesson.order,
              moduleId: createdModule.id,
            })),
          });
        }
      }
    }

    // Handle course information update
    if (information) {
      const existingInfo = await prisma.courseInformation.findUnique({
        where: { courseId: id },
      });

      if (existingInfo) {
        // Update existing information
        await prisma.courseInformation.update({
          where: { courseId: id },
          data: {
            includes: information.includes || [],
            learningOutcomes: information.learningOutcomes || [],
            requirements: information.requirements || [],
          },
        });
      } else {
        // Create new information
        await prisma.courseInformation.create({
          data: {
            courseId: id,
            includes: information.includes || [],
            learningOutcomes: information.learningOutcomes || [],
            requirements: information.requirements || [],
          },
        });
      }
    }

    if (user?.role === "EMPLOYEE") {
      await prisma.course.update({
        where: { id: updatedCourse.id },
        data: { status: "PENDING" },
      });
    }

    if (user?.role === "ADMIN") {
      await prisma.course.update({
        where: { id: updatedCourse.id },
        data: { status: "PUBLISHED" },
      });
    }

    return NextResponse.json(
      { success: true, courseId: updatedCourse.id },
      { status: 200 },
    );
  } catch (error) {
    console.error("UPDATE COURSE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 },
    );
  }
}




// What this API does:
// Deletes a course permanently
// Only ADMIN is allowed.
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 },
      );
    }

    const userId: string | null = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId || undefined },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You can't delete course" },
        { status: 500 },
      );
    }

    await prisma.course.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Course deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE COURSE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 },
    );
  }
}
