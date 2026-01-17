import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { createRazorpayOrder } from "@/lib/razorpay";
import { ApiResponse, RazorpayOrderResponse } from "@/lib/types";

/**
 * POST /api/enrollment/partial-payment
 * Creates a Razorpay order for remaining payment amount
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
        const { enrollmentId, amount } = body;

        if (!enrollmentId || !amount) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: "Enrollment ID and amount are required" },
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

        // Verify enrollment is PENDING
        if (enrollment.status !== "PENDING") {
            return NextResponse.json<ApiResponse>(
                { success: false, message: "Enrollment is not pending" },
                { status: 400 }
            );
        }

        // Create Razorpay order for remaining amount
        const razorpayOrder = await createRazorpayOrder({
            amount: amount,
            currency: "INR",
            receipt: `partial_payment_${Date.now()}`,
            notes: {
                enrollmentId: enrollment.id,
                courseId: enrollment.courseId,
                userId: session.user.id,
                type: "partial_payment",
            },
        });

        // Update enrollment with new order ID
        await prisma.enrollment.update({
            where: { id: enrollmentId },
            data: {
                razorpayOrderId: razorpayOrder.id,
            },
        });

        const responseData: RazorpayOrderResponse = {
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            enrollmentId: enrollment.id,
        };

        return NextResponse.json<ApiResponse<RazorpayOrderResponse>>(
            {
                success: true,
                message: "Partial payment order created",
                data: responseData,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Partial payment error:", error);
        return NextResponse.json<ApiResponse>(
            { success: false, message: "Failed to create partial payment order" },
            { status: 500 }
        );
    }
}
