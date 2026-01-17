import { prisma } from "@/lib/db";
import { CourseCard } from "@/components/shared/CourseCard";
import { BookOpen } from "lucide-react";

/**
 * Course Catalog Page
 * Displays all available courses in a grid layout
 */
export default async function CoursesPage() {
    // Fetch all courses
    const courses = await prisma.course.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
            price: true,
            duration: true,
            type: true,
        },
    });

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="container px-4 md:px-6 mx-auto max-w-7xl">
                {/* Header */}
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                        <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
                        Explore Our <span className="text-primary">Courses</span>
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground text-lg">
                        Choose from our comprehensive catalog of industry-leading courses designed to transform your career
                    </p>
                </div>

                {/* Courses Grid */}
                {courses.length > 0 ? (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center p-4 bg-muted rounded-full mb-4">
                            <BookOpen className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-semibold text-foreground mb-2">
                            No Courses Available
                        </h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            We're working on adding new courses. Check back soon for exciting learning opportunities!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
