import { prisma } from "@/lib/db";
import { CourseCard } from "@/components/shared/CourseCard";
import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { BookOpen, Filter } from "lucide-react";

/**
 * Course Catalog Page - Premium Design
 * Displays all available courses in an elegant grid layout
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
        <div className="min-h-screen bg-background">

            {/* Hero Section */}
            <section className="relative py-24 bg-card border-b border-primary/10 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-grid-premium opacity-20 z-0" />

                {/* Gold Accent Line */}
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/50 to-transparent z-10" />

                <div className="container-premium relative z-20">
                    <AnimatedSection>
                        <div className="text-center space-y-6 max-w-3xl mx-auto">
                            <div className="inline-block px-4 py-1 border border-primary/20 bg-primary/5">
                                <span className="text-primary font-accent text-sm tracking-wider uppercase">Course Catalog</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
                                Explore Our <span className="text-gold-gradient">Programs</span>
                            </h1>

                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Industry-leading courses designed to transform your creative career.
                                Choose your path to excellence.
                            </p>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* Courses Grid Section */}
            <section className="section-padding relative z-10">
                <div className="container-premium">

                    {courses.length > 0 ? (
                        <>
                            {/* Stats Bar */}
                            <AnimatedSection>
                                <div className="flex items-center justify-between mb-16 pb-6 border-b border-primary/10">
                                    <div className="flex items-center gap-3">
                                        <BookOpen className="h-6 w-6 text-primary" />
                                        <span className="text-lg font-semibold">
                                            {courses.length} {courses.length === 1 ? 'Course' : 'Courses'} Available
                                        </span>
                                    </div>
                                    {/* Future: Add filter/sort controls here */}
                                </div>
                            </AnimatedSection>

                            {/* Courses Grid */}
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {courses.map((course, index) => (
                                    <AnimatedSection key={course.id} delay={index * 0.1}>
                                        <CourseCard course={course} />
                                    </AnimatedSection>
                                ))}
                            </div>
                        </>
                    ) : (
                        /* Empty State */
                        <AnimatedSection>
                            <div className="text-center py-32">
                                <div className="inline-flex items-center justify-center p-8 border border-primary/20 bg-primary/5 mb-8">
                                    <BookOpen className="h-20 w-20 text-primary" />
                                </div>
                                <h3 className="text-3xl font-bold mb-4">
                                    No Courses Available
                                </h3>
                                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                                    We're curating exceptional learning experiences.
                                    Check back soon for new courses!
                                </p>
                            </div>
                        </AnimatedSection>
                    )}

                </div>
            </section>

        </div>
    );
}
