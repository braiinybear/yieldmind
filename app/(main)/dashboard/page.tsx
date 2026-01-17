import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { EnrollmentCard } from "@/components/shared/EnrollmentCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GraduationCap, BookOpen } from "lucide-react";

/**
 * Student Dashboard Page
 * Protected route showing user's enrolled courses
 */
export default async function DashboardPage() {
    // Check authentication
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    // Fetch user's enrollments
    const enrollments = await prisma.enrollment.findMany({
        where: { userId: session.user.id },
        include: {
            Course: true,
        },
        orderBy: { enrolledAt: 'desc' },
    });

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="container px-4 md:px-6 mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                        <GraduationCap className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground mb-2">
                        My Dashboard
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Welcome back, <span className="font-semibold text-foreground">{session.user.name}</span>!
                        Continue your learning journey.
                    </p>
                </div>

                {/* Enrollments Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                        My Enrollments
                    </h2>

                    {enrollments.length > 0 ? (
                        <div className="grid gap-6 lg:grid-cols-2">
                            {enrollments.map((enrollment) => (
                                <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
                            ))}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="text-center py-16 bg-card border rounded-xl">
                            <div className="inline-flex items-center justify-center p-4 bg-muted rounded-full mb-4">
                                <BookOpen className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <h3 className="text-2xl font-semibold text-foreground mb-2">
                                No Enrollments Yet
                            </h3>
                            <p className="text-muted-foreground max-w-md mx-auto mb-6">
                                You haven't enrolled in any courses yet. Explore our course catalog to get started!
                            </p>
                            <Button asChild size="lg">
                                <Link href="/courses">
                                    Browse Courses
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Quick Stats (Optional Enhancement) */}
                {enrollments.length > 0 && (
                    <div className="grid gap-6 md:grid-cols-3 mt-12">
                        <div className="bg-card border rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-500/10 rounded-lg">
                                    <GraduationCap className="h-5 w-5 text-green-600" />
                                </div>
                                <h3 className="font-semibold text-foreground">Active Courses</h3>
                            </div>
                            <p className="text-3xl font-bold text-primary">
                                {enrollments.filter((e) => e.status === "ACTIVE").length}
                            </p>
                        </div>

                        <div className="bg-card border rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <BookOpen className="h-5 w-5 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-foreground">Total Enrolled</h3>
                            </div>
                            <p className="text-3xl font-bold text-primary">
                                {enrollments.length}
                            </p>
                        </div>

                        <div className="bg-card border rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    <GraduationCap className="h-5 w-5 text-purple-600" />
                                </div>
                                <h3 className="font-semibold text-foreground">Completed</h3>
                            </div>
                            <p className="text-3xl font-bold text-primary">
                                {enrollments.filter((e) => e.status === "COMPLETED").length}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
