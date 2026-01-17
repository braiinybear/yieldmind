import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { razorpayInstance } from "@/lib/razorpay";
import { ApiResponse } from "@/lib/types";

/**
 * POST /api/enrollment/reconcile
 * Manually reconcile a pending payment by checking with Razorpay
 */
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { enrollmentId } = body;

        if (!enrollmentId) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: "Enrollment ID is required" },
                { status: 400 }
            );
        }

        // Fetch enrollment
        const enrollment = await prisma.enrollment.findUnique({
            where: { id: enrollmentId },
            include: { Course: true },
        });

        if (!enrollment) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: "Enrollment not found" },
                { status: 404 }
            );
        }

        // Check ownership
        if (enrollment.userId !== session.user.id) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: "Unauthorized" },
                { status: 403 }
            );
        }

        // If already active, nothing to do
        if (enrollment.status === "ACTIVE") {
            return NextResponse.json<ApiResponse>(
                { success: true, message: "Enrollment is already active" },
                { status: 200 }
            );
        }

        // Check if we have a Razorpay order ID
        if (!enrollment.razorpayOrderId) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: "No payment order found for this enrollment" },
                { status: 400 }
            );
        }

        // Query Razorpay to check payment status
        if (!razorpayInstance) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: "Payment gateway not configured" },
                { status: 500 }
            );
        }

        try {
            // Fetch order details from Razorpay
            const order = await razorpayInstance.orders.fetch(enrollment.razorpayOrderId);

            // Check if order is paid
            if (order.status === "paid") {
                // Fetch payments for this order
                const payments = await razorpayInstance.orders.fetchPayments(enrollment.razorpayOrderId);

                if (payments.items && payments.items.length > 0) {
                    const successfulPayment = payments.items.find(
                        (p: any) => p.status === "captured" || p.status === "authorized"
                    );

                    if (successfulPayment) {
                        // Update enrollment to ACTIVE
                        await prisma.enrollment.update({
                            where: { id: enrollmentId },
                            data: {
                                status: "ACTIVE",
                                amountPaid: enrollment.Course.price,
                                razorpayPaymentId: successfulPayment.id,
                            },
                        });

                        return NextResponse.json<ApiResponse>(
                            {
                                success: true,
                                message: "Payment verified! Your enrollment is now active.",
                            },
                            { status: 200 }
                        );
                    }
                }
            }

            // If we reach here, payment wasn't found or not successful
            return NextResponse.json<ApiResponse>(
                {
                    success: false,
                    message: "Payment not found or not completed. Please contact support with your order ID.",
                },
                { status: 400 }
            );

        } catch (razorpayError) {
            console.error("Razorpay reconciliation error:", razorpayError);
            return NextResponse.json<ApiResponse>(
                {
                    success: false,
                    message: "Failed to verify payment status. Please contact support.",
                },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error("Reconciliation error:", error);
        return NextResponse.json<ApiResponse>(
            { success: false, message: "Failed to reconcile payment" },
            { status: 500 }
        );
    }
}
