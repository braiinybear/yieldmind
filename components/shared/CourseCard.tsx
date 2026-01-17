import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CourseCardData } from "@/lib/types";
import { formatPrice } from "@/lib/formatters";
import { Clock, MapPin } from "lucide-react";
import { CourseType } from "@prisma/client";

interface CourseCardProps {
    course: CourseCardData;
}

/**
 * Reusable CourseCard component
 * Displays course information in a card format
 */
export function CourseCard({ course }: CourseCardProps) {
    return (
        <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Thumbnail */}
            <div className="relative h-48 overflow-hidden rounded-t-xl bg-muted">
                {course.thumbnail ? (
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/20 to-accent/20">
                        <span className="text-4xl font-bold text-muted-foreground/30">
                            {course.title.charAt(0)}
                        </span>
                    </div>
                )}

                {/* Course Type Badge */}
                <div className="absolute top-3 right-3">
                    <CourseTypeBadge type={course.type} />
                </div>
            </div>

            <CardHeader>
                <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                    {course.title}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                {/* Price */}
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                        {formatPrice(course.price)}
                    </span>
                </div>

                {/* Duration */}
                {course.duration && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                    </div>
                )}
            </CardContent>

            <CardFooter>
                <Button asChild className="w-full" variant="default">
                    <Link href={`/courses/${course.slug}`}>
                        View Details
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

/**
 * Course Type Badge component
 * Shows different colors based on course type
 */
function CourseTypeBadge({ type }: { type: CourseType }) {
    const variants: Record<CourseType, { label: string; className: string }> = {
        OFFLINE: {
            label: "Offline",
            className: "bg-blue-500/90 text-white border-blue-600",
        },
        ONLINE: {
            label: "Online",
            className: "bg-green-500/90 text-white border-green-600",
        },
        HYBRID: {
            label: "Hybrid",
            className: "bg-purple-500/90 text-white border-purple-600",
        },
    };

    const variant = variants[type];

    return (
        <Badge className={variant.className}>
            {variant.label}
        </Badge>
    );
}
