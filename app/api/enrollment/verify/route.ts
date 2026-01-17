import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { ApiResponse } from "@/lib/types";

/**
 * POST /api/enrollment/verify
 * Verifies Razorpay payment and updates enrollment status
 */
export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            enrollmentId,
        } = body;

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !enrollmentId) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: "Missing required payment information" },
                { status: 400 }
            );
        }

        // Verify Razorpay signature
        const isValid = verifyRazorpaySignature({
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
        });

        if (!isValid) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: "Invalid payment signature" },
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

        // Check if already verified
        if (enrollment.status === "ACTIVE") {
            return NextResponse.json<ApiResponse>(
                { success: true, message: "Enrollment already active" },
                { status: 200 }
            );
        }

        // Update enrollment with payment details
        await prisma.enrollment.update({
            where: { id: enrollmentId },
            data: {
                status: "ACTIVE",
                amountPaid: enrollment.Course.price,
                razorpayPaymentId: razorpay_payment_id,
            },
        });

        return NextResponse.json<ApiResponse>(
            {
                success: true,
                message: "Payment verified successfully. Enrollment is now active!",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Payment verification error:", error);
        return NextResponse.json<ApiResponse>(
            { success: false, message: "Failed to verify payment. Please contact support." },
            { status: 500 }
        );
    }
}
