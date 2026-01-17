import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyRazorpaySignature, razorpayInstance } from "@/lib/razorpay";
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

        // Fetch the Razorpay order to get the actual payment amount
        let paymentAmountInRupees = 0;
        if (razorpayInstance) {
            try {
                const order = await razorpayInstance.orders.fetch(razorpay_order_id);
                paymentAmountInRupees = Number(order.amount) / 100; // Convert paise to rupees
            } catch (error) {
                console.error("Failed to fetch Razorpay order:", error);
                // Fallback: assume full course price
                paymentAmountInRupees = enrollment.Course.price;
            }
        } else {
            // Fallback if Razorpay not configured
            paymentAmountInRupees = enrollment.Course.price;
        }

        // Calculate new total and check if fully paid
        const newTotalPaid = enrollment.amountPaid + paymentAmountInRupees;
        const isFullyPaid = newTotalPaid >= enrollment.Course.price;

        // Update enrollment with payment details
        await prisma.enrollment.update({
            where: { id: enrollmentId },
            data: {
                status: isFullyPaid ? "ACTIVE" : "PENDING",
                amountPaid: newTotalPaid,
                razorpayPaymentId: razorpay_payment_id,
            },
        });

        return NextResponse.json<ApiResponse>(
            {
                success: true,
                message: isFullyPaid
                    ? "Payment verified successfully. Enrollment is now active!"
                    : `Partial payment of ₹${paymentAmountInRupees} received. Remaining: ₹${enrollment.Course.price - newTotalPaid}`,
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
