import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSlug } from "@/lib/formatters";
import { getCurrentUserId } from "@/utility/currentSession";

interface Lesson {
  title: string;
  description?: string;
  videoUrl?: string;
  isFree: boolean;
  order: number;
}
// POST → Create a new course (with modules, lessons, and extra info)
export async function POST(req: Request) {
  try {
    const { course, modules, information } = await req.json();
    console.log("information", information);
    console.log("course", course);
    console.log("modules", modules);

    const userId: string | null = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId || undefined },
    });

    if (user?.role === "STUDENT") {
      return NextResponse.json(
        { error: "You can't create course" },
        { status: 500 },
      );
    }

    const createdCourse = await prisma.course.create({
      data: {
        title: course.title,
        slug: createSlug(course.slug),
        shortDescription:course.shortDescription,
        description: course.description,
        thumbnail: course.thumbnail || null,
        demoVideo: course.demoVideo,
        instructorName: course.instructorName,
        instructorBio: course.instructorBio,
        creatorId: userId,
        price: course.price,
        type: course.type,
        venue: course.venue || null,
        startDate: course.startDate ? new Date(course.startDate) : null,
        batchSize: course.batchSize,
        duration: course.duration || null,
      },
    });

    for (const moduleData of modules) {
      const createdModule = await prisma.courseModule.create({
        data: {
          title: moduleData.title,
          order: moduleData.order,
          courseId: createdCourse.id,
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

    if (information) {
      await prisma.courseInformation.create({
        data: {
          courseId: createdCourse.id,
          includes: information.includes || [],
          learningOutcomes: information.learningOutcomes || [],
          requirements: information.requirements || [],
        },
      });
    }
    return NextResponse.json(
      { success: true, courseId: createdCourse.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("CREATE COURSE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 },
    );
  }
}
// GET → Fetch courses based on user role (Admin / Employee / Student)
export async function GET() {
  try {
    const userId: string | null = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId || undefined },
    });

    let whereClause = {};

    if (user?.role === "ADMIN") {
      // Admin gets all courses
      whereClause = {};
    } else if (user?.role === "EMPLOYEE") {
      // Employee gets only courses they created
      whereClause = {
        creatorId: userId,
      };
    } else {
      // Students get only published courses
      whereClause = {
        status: "PUBLISHED",
      };
    }

    const courses = await prisma.course.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, data: courses }, { status: 200 });
  } catch (error) {
    console.error("GET COURSES ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 },
    );
  }
}
