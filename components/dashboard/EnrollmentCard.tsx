import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatPrice } from "@/lib/formatters";
import { Calendar, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import { VerifyPaymentButton } from "@/components/dashboard/VerifyPaymentButton";
import { RetryPaymentButton } from "@/components/dashboard/RetryPaymentButton";
import { CancelEnrollmentButton } from "@/components/dashboard/CancelEnrollmentButton";

interface EnrollmentCardProps {
    enrollment: {
        id: string;
        status: string;
        amountPaid: number;
        enrolledAt: Date;
        Course: {
            id: string;
            title: string;
            slug: string;
            description: string;
            thumbnail: string | null;
            duration: string | null;
            price: number;
        };
    };
}

export function EnrollmentCard({ enrollment }: EnrollmentCardProps) {
    const statusConfig = {
        ACTIVE: {
            label: "Active",
            icon: CheckCircle2,
            className: "bg-green-500/10 text-green-600 border-green-500/20",
        },
        PENDING: {
            label: "Pending Payment",
            icon: Clock,
            className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
        },
        COMPLETED: {
            label: "Completed",
            icon: CheckCircle2,
            className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        },
        CANCELLED: {
            label: "Cancelled",
            icon: XCircle,
            className: "bg-red-500/10 text-red-600 border-red-500/20",
        },
    };

    const status = statusConfig[enrollment.status as keyof typeof statusConfig] || statusConfig.PENDING;
    const StatusIcon = status.icon;

    // Calculate if this is a partial payment or failed payment
    const isPending = enrollment.status === "PENDING";
    const hasPartialPayment = enrollment.amountPaid > 0 && enrollment.amountPaid < enrollment.Course.price;
    const hasNoPayment = enrollment.amountPaid === 0;
    const remainingAmount = enrollment.Course.price - enrollment.amountPaid;

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{enrollment.Course.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                            {enrollment.Course.description}
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className={status.className}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                    </div>
                    {enrollment.Course.duration && (
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{enrollment.Course.duration}</span>
                        </div>
                    )}
                </div>

                {isPending && (
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 space-y-2">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                {hasNoPayment ? (
                                    <>
                                        <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                                            Payment Not Completed
                                        </p>
                                        <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                            If you already paid, click "Verify Payment". Otherwise, complete your payment or cancel this enrollment.
                                        </p>
                                    </>
                                ) : hasPartialPayment ? (
                                    <>
                                        <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                                            Partial Payment Received
                                        </p>
                                        <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                            Remaining: {formatPrice(remainingAmount)}
                                        </p>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            {isPending && hasNoPayment ? "Total Amount" : "Amount Paid"}
                        </p>
                        <p className="text-lg font-bold text-primary">
                            {isPending && hasNoPayment
                                ? formatPrice(enrollment.Course.price)
                                : formatPrice(enrollment.amountPaid)
                            }
                        </p>
                        {hasPartialPayment && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Remaining: {formatPrice(remainingAmount)}
                            </p>
                        )}
                    </div>

                    {isPending ? (
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <VerifyPaymentButton enrollmentId={enrollment.id} />
                                <RetryPaymentButton
                                    enrollmentId={enrollment.id}
                                    courseId={enrollment.Course.id}
                                    courseName={enrollment.Course.title}
                                    remainingAmount={remainingAmount}
                                    coursePrice={enrollment.Course.price}
                                />
                            </div>
                            <CancelEnrollmentButton enrollmentId={enrollment.id} />
                        </div>
                    ) : (
                        <Button asChild>
                            <Link href={`/courses/${enrollment.Course.slug}`}>
                                View Course
                            </Link>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
