import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import type { CourseType } from "@prisma/client";

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
  startDate: Date | null;
  batchSize: number;
  duration: string | null;
  slug?: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const course = await prisma.course.findUnique({
      where: { id },
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
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: course },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET COURSE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const { course, modules } = await req.json();

    // Fetch existing course to check if slug has changed
    const existingCourse = await prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Build update data, only including slug if it's different
    const updateData: CourseUpdateData = {
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail || null,
      price: course.price,
      type: course.type,
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

    return NextResponse.json(
      { success: true, courseId: updatedCourse.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE COURSE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    await prisma.course.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Course deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE COURSE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
