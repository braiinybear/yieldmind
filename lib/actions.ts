"use server";

import { prisma } from "@/lib/db";
import { cache } from "react";

export const getCourseBySlug = cache(async (slug: string) => {
    try {
        const course = await prisma.course.findUnique({
            where: { slug },
            include: {
                modules: {
                    include: {
                        lessons: {
                            orderBy: { order: "asc" },
                        },
                    },
                    orderBy: { order: "asc" },
                },
                information: true,
            },
        });
        return course;
    } catch (error) {
        console.error("Error fetching course:", error);
        return null;
    }
});

export const getEnrollmentStatus = cache(async (courseId: string, userId: string) => {
    try {
        const enrollment = await prisma.enrollment.findFirst({
            where: {
                courseId,
                userId,
                status: {
                    in: ["ACTIVE", "COMPLETED", "PENDING"],
                },
            },
        });
        return enrollment; // Return full object or null
    } catch (error) {
        console.error("Error fetching enrollment status:", error);
        return null;
    }
});
