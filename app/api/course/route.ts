import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface Lesson {
  title: string;
  description?: string;
  videoUrl?: string;
  isFree: boolean;
  order: number;
}





export async function POST(req: Request) {
  try {
    const { course, modules } = await req.json();
    console.log(course);
    

    const createdCourse = await prisma.course.create({
      data: {
        title: course.title,
        slug: course.slug,
        description: course.description,
        thumbnail: course.thumbnail || null,
        price: course.price,
        type: course.type,
        venue: course.venue || null,
        startDate: course.startDate
          ? new Date(course.startDate)
          : null,
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

    return NextResponse.json(
      { success: true, courseId: createdCourse.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE COURSE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const courses = await prisma.course.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      { success: true, data: courses },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET COURSES ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
