import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EnrollmentWithCourse } from "@/lib/types";
import { formatPrice, formatDate } from "@/lib/formatters";
import { EnrollmentStatus } from "@prisma/client";
import { CheckCircle2, Clock, XCircle, Ban } from "lucide-react";

interface EnrollmentCardProps {
    enrollment: EnrollmentWithCourse;
}

/**
 * Reusable EnrollmentCard component
 * Displays enrollment information with course details
 */
export function EnrollmentCard({ enrollment }: EnrollmentCardProps) {
    const { Course, status, amountPaid, enrolledAt } = enrollment;

    return (
        <Card className="group hover:shadow-lg transition-all duration-300">
            <div className="flex flex-col md:flex-row">
                {/* Thumbnail */}
                <div className="relative h-48 md:h-auto md:w-48 overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-tr-none bg-muted shrink-0">
                    {Course.thumbnail ? (
                        <img
                            src={Course.thumbnail}
                            alt={Course.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/20 to-accent/20">
                            <span className="text-4xl font-bold text-muted-foreground/30">
                                {Course.title.charAt(0)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <CardTitle className="text-xl line-clamp-2">
                                {Course.title}
                            </CardTitle>
                            <EnrollmentStatusBadge status={status} />
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 space-y-3">
                        {/* Amount Paid */}
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Amount Paid:</span>
                            <span className="font-semibold text-primary">
                                {formatPrice(amountPaid)}
                            </span>
                        </div>

                        {/* Enrolled Date */}
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Enrolled On:</span>
                            <span className="font-medium">
                                {formatDate(enrolledAt)}
                            </span>
                        </div>

                        {/* Duration */}
                        {Course.duration && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Duration:</span>
                                <span className="font-medium">{Course.duration}</span>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter>
                        <Button
                            asChild
                            className="w-full"
                            variant={status === "ACTIVE" ? "default" : "outline"}
                            disabled={status === "CANCELLED"}
                        >
                            <Link href={`/courses/${Course.slug}`}>
                                {status === "ACTIVE" ? "Continue Learning" : "View Course"}
                            </Link>
                        </Button>
                    </CardFooter>
                </div>
            </div>
        </Card>
    );
}

/**
 * Enrollment Status Badge component
 * Shows different colors and icons based on status
 */
function EnrollmentStatusBadge({ status }: { status: EnrollmentStatus }) {
    const variants: Record<
        EnrollmentStatus,
        { label: string; className: string; icon: React.ReactNode }
    > = {
        PENDING: {
            label: "Pending",
            className: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
            icon: <Clock className="h-3 w-3" />,
        },
        ACTIVE: {
            label: "Active",
            className: "bg-green-500/10 text-green-700 border-green-500/20",
            icon: <CheckCircle2 className="h-3 w-3" />,
        },
        COMPLETED: {
            label: "Completed",
            className: "bg-blue-500/10 text-blue-700 border-blue-500/20",
            icon: <CheckCircle2 className="h-3 w-3" />,
        },
        CANCELLED: {
            label: "Cancelled",
            className: "bg-red-500/10 text-red-700 border-red-500/20",
            icon: <XCircle className="h-3 w-3" />,
        },
    };

    const variant = variants[status];

    return (
        <Badge className={variant.className}>
            {variant.icon}
            {variant.label}
        </Badge>
    );
}
