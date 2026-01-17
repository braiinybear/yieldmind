import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { ModuleSyllabus } from "@/components/shared/ModuleSyllabus";
import { EnrollButton } from "@/components/shared/EnrollButton";
import { formatPrice, formatDate } from "@/lib/formatters";
import { Clock, Calendar, Users, MapPin, BookOpen } from "lucide-react";
import { CourseType } from "@prisma/client";

interface CourseDetailsPageProps {
    params: Promise<{ slug: string }>;
}

/**
 * Course Details Page
 * Displays full course information including syllabus and enrollment option
 */
export default async function CourseDetailsPage({ params }: CourseDetailsPageProps) {
    const { slug } = await params;

    // Fetch course with modules and lessons
    const course = await prisma.course.findUnique({
        where: { slug },
        include: {
            modules: {
                include: {
                    lessons: {
                        orderBy: { order: 'asc' },
                    },
                },
                orderBy: { order: 'asc' },
            },
        },
    });

    // Handle 404
    if (!course) {
        notFound();
    }

    const totalLessons = course.modules.reduce(
        (acc, module) => acc + module.lessons.length,
        0
    );

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative bg-linear-to-br from-primary/10 via-background to-accent/5 py-16 border-b">
                <div className="container px-4 md:px-6 mx-auto max-w-7xl">
                    <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                        {/* Left: Course Info */}
                        <div className="space-y-6">
                            {/* Course Type Badge */}
                            <CourseTypeBadge type={course.type} />

                            {/* Title */}
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
                                {course.title}
                            </h1>

                            {/* Description */}
                            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                                {course.description}
                            </p>

                            {/* Course Stats */}
                            <div className="flex flex-wrap gap-6 pt-4">
                                {course.duration && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-5 w-5 text-primary" />
                                        <span className="font-medium">{course.duration}</span>
                                    </div>
                                )}

                                {course.startDate && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="h-5 w-5 text-primary" />
                                        <span className="font-medium">Starts {formatDate(course.startDate)}</span>
                                    </div>
                                )}

                                {course.batchSize && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users className="h-5 w-5 text-primary" />
                                        <span className="font-medium">Batch Size: {course.batchSize}</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 text-sm">
                                    <BookOpen className="h-5 w-5 text-primary" />
                                    <span className="font-medium">
                                        {course.modules.length} Modules • {totalLessons} Lessons
                                    </span>
                                </div>
                            </div>

                            {/* Venue (for OFFLINE/HYBRID) */}
                            {(course.type === "OFFLINE" || course.type === "HYBRID") && course.venue && (
                                <div className="flex items-start gap-3 p-4 bg-card border rounded-lg">
                                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-sm text-foreground mb-1">Venue</p>
                                        <p className="text-sm text-muted-foreground">{course.venue}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: Enrollment Card */}
                        <div className="lg:sticky lg:top-24 h-fit">
                            <div className="bg-card border rounded-xl p-6 shadow-lg space-y-6">
                                {/* Price */}
                                <div className="text-center py-4 border-b">
                                    <p className="text-sm text-muted-foreground mb-2">Course Fee</p>
                                    <p className="text-4xl font-bold text-primary">
                                        {formatPrice(course.price)}
                                    </p>
                                </div>

                                {/* Enroll Button */}
                                <EnrollButton courseId={course.id} coursePrice={course.price} />

                                {/* Features */}
                                <div className="space-y-3 pt-4 border-t text-sm">
                                    <div className="flex items-center gap-2">
                                        <CheckIcon />
                                        <span>Lifetime Access</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckIcon />
                                        <span>Certificate of Completion</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckIcon />
                                        <span>Expert Instructor Support</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckIcon />
                                        <span>Hands-on Projects</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Syllabus Section */}
            <section className="py-16">
                <div className="container px-4 md:px-6 mx-auto max-w-4xl">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-foreground mb-2">
                            Course Syllabus
                        </h2>
                        <p className="text-muted-foreground">
                            Explore the comprehensive curriculum designed by industry experts
                        </p>
                    </div>

                    <ModuleSyllabus modules={course.modules} />
                </div>
            </section>
        </div>
    );
}

/**
 * Course Type Badge component
 */
function CourseTypeBadge({ type }: { type: CourseType }) {
    const variants: Record<CourseType, { label: string; className: string }> = {
        OFFLINE: {
            label: "📍 Offline",
            className: "bg-blue-500/10 text-blue-700 border-blue-500/20",
        },
        ONLINE: {
            label: "💻 Online",
            className: "bg-green-500/10 text-green-700 border-green-500/20",
        },
        HYBRID: {
            label: "🔄 Hybrid",
            className: "bg-purple-500/10 text-purple-700 border-purple-500/20",
        },
    };

    const variant = variants[type];

    return (
        <Badge variant="outline" className={`${variant.className} text-sm px-3 py-1`}>
            {variant.label}
        </Badge>
    );
}

/**
 * Check Icon component
 */
function CheckIcon() {
    return (
        <svg
            className="h-5 w-5 text-green-600 shrink-0"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path d="M5 13l4 4L19 7" />
        </svg>
    );
}
