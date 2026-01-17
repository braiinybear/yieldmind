"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formatters";
import { CheckCircle, Lock, PlayCircle, Clock, Award, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import EnrollButton from "./EnrollButton";
import Link from "next/link";

interface EnrollmentCardProps {
    course: any;
    enrollment: any; // Enrollment object or null
}

export default function EnrollmentCard({ course, enrollment }: EnrollmentCardProps) {
    const { data: session } = useSession();
    const router = useRouter();

    const isEnrolled = enrollment?.status === "ACTIVE" || enrollment?.status === "COMPLETED";
    const isPending = enrollment?.status === "PENDING";

    return (
        <div className="sticky top-24">
            <div className="bg-card border border-primary/20 p-8 shadow-strong relative overflow-hidden group">
                {/* Gold Accent Overlay */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient" />
                <div className="absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none" />

                <div className="space-y-8 relative z-10">
                    {/* Price Section */}
                    <div className="space-y-2">
                        <p className="text-muted-foreground font-accent text-sm uppercase tracking-widest">Total Investment</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-foreground">
                                {formatPrice(course.price)}
                            </span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="space-y-3">
                        {isPending ? (
                            <>
                                <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-3">
                                    <div className="flex items-start gap-2">
                                        <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                                                Payment Pending
                                            </p>
                                            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                                Complete your payment or verify if already paid
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    className="w-full h-14 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 font-bold text-lg rounded-none uppercase tracking-wider"
                                    asChild
                                >
                                    <Link href="/dashboard">
                                        Go to Dashboard
                                    </Link>
                                </Button>
                            </>
                        ) : isEnrolled ? (
                            <Button
                                className="w-full h-14 bg-success/10 text-success border border-success/20 hover:bg-success/20 font-bold text-lg rounded-none uppercase tracking-wider"
                                disabled
                            >
                                <CheckCircle className="mr-2 h-5 w-5" />
                                Already Enrolled
                            </Button>
                        ) : session ? (
                            <EnrollButton
                                courseId={course.id}
                                price={course.price}
                                courseName={course.title}
                            />
                        ) : (
                            <Button
                                className="w-full btn-gold h-14 text-lg font-bold rounded-none uppercase tracking-wider shadow-gold"
                                onClick={() => router.push("/login")}
                            >
                                <Lock className="mr-2 h-5 w-5" />
                                Login to Enroll
                            </Button>
                        )}

                        <p className="text-xs text-center text-muted-foreground font-accent">
                            30-Day Money-Back Guarantee
                        </p>
                    </div>

                    {/* Features List */}
                    <div className="space-y-6 pt-6 border-t border-border">
                        <h4 className="font-bold text-lg">This Course Includes:</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-muted-foreground">
                                <PlayCircle className="h-5 w-5 text-primary" />
                                <span>12+ Hours of Video Content</span>
                            </li>
                            <li className="flex items-center gap-3 text-muted-foreground">
                                <Clock className="h-5 w-5 text-primary" />
                                <span>Full Lifetime Access</span>
                            </li>
                            <li className="flex items-center gap-3 text-muted-foreground">
                                <Award className="h-5 w-5 text-primary" />
                                <span>Certificate of Completion</span>
                            </li>
                            <li className="flex items-center gap-3 text-muted-foreground">
                                <CheckCircle className="h-5 w-5 text-primary" />
                                <span>Access on Mobile and TV</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
