import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CourseCardData } from "@/lib/types";
import { formatPrice } from "@/lib/formatters";
import { Clock, ArrowRight } from "lucide-react";
import { CourseType } from "@prisma/client";

interface CourseCardProps {
    course: CourseCardData;
}

/**
 * Premium CourseCard Component
 * Luxury design with sharp edges and sophisticated hover effects
 */
export function CourseCard({ course }: CourseCardProps) {
    return (
        <Link href={`/courses/${course.slug}`} className="group block">
            <div className="relative overflow-hidden border border-border bg-card transition-all duration-500 hover:border-primary hover:shadow-2xl">

                {/* Gold Accent Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Thumbnail */}
                <div className="relative h-64 overflow-hidden bg-muted">
                    {course.thumbnail ? (
                        <>
                            <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/10 to-primary/5">
                            <span className="text-6xl font-bold text-primary/20 font-serif">
                                {course.title.charAt(0)}
                            </span>
                        </div>
                    )}

                    {/* Course Type Badge */}
                    <div className="absolute top-4 right-4">
                        <CourseTypeBadge type={course.type} />
                    </div>
                </div>

                {/* Content */}
                <div className="p-10 space-y-8">

                    {/* Title */}
                    <h3 className="text-2xl font-bold line-clamp-2 group-hover:text-primary transition-colors duration-300">
                        {course.title}
                    </h3>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between pt-6 border-t border-border/50">
                        {/* Duration */}
                        {course.duration && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm font-accent uppercase tracking-wide">{course.duration}</span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="text-2xl font-bold text-gold-gradient">
                            {formatPrice(course.price)}
                        </div>
                    </div>

                    {/* View Details Link */}
                    <div className="flex items-center gap-2 text-primary font-accent font-semibold uppercase tracking-wider text-sm pt-4">
                        <span className="underline-animated">View Details</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                    </div>
                </div>

            </div>
        </Link>
    );
}

/**
 * Course Type Badge - Premium Design
 */
function CourseTypeBadge({ type }: { type: CourseType }) {
    const variants: Record<CourseType, { label: string; className: string }> = {
        OFFLINE: {
            label: "OFFLINE",
            className: "bg-blue-600/90 text-white border border-blue-400/30 backdrop-blur-sm",
        },
        ONLINE: {
            label: "ONLINE",
            className: "bg-green-600/90 text-white border border-green-400/30 backdrop-blur-sm",
        },
        HYBRID: {
            label: "HYBRID",
            className: "bg-purple-600/90 text-white border border-purple-400/30 backdrop-blur-sm",
        },
    };

    const variant = variants[type];

    return (
        <Badge className={`${variant.className} font-accent font-semibold text-xs tracking-wider px-3 py-1`}>
            {variant.label}
        </Badge>
    );
}
