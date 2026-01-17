import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { createRazorpayOrder } from "@/lib/razorpay";
import { ApiResponse, RazorpayOrderResponse } from "@/lib/types";

/**
 * POST /api/enrollment/create
 * Creates a new enrollment and Razorpay order
 */
export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: "Unauthorized. Please login to enroll." },
                { status: 401 }
            );
        }

        // Parse request body
        const body = await request.json();
        const { courseId } = body;

        if (!courseId) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: "Course ID is required" },
                { status: 400 }
            );
        }

        // Fetch course
        const course = await prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!course) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: "Course not found" },
                { status: 404 }
            );
        }

        // Check if user is already enrolled
        const existingEnrollment = await prisma.enrollment.findFirst({
            where: {
                userId: session.user.id,
                courseId: courseId,
                status: { in: ["ACTIVE", "PENDING", "COMPLETED"] },
            },
        });

        if (existingEnrollment) {
            // If ACTIVE or COMPLETED, block
            if (existingEnrollment.status === "ACTIVE" || existingEnrollment.status === "COMPLETED") {
                return NextResponse.json<ApiResponse>(
                    { success: false, message: "You are already enrolled in this course" },
                    { status: 400 }
                );
            }

            // If PENDING, delete it to allow fresh restart (simple retry mechanism)
            if (existingEnrollment.status === "PENDING") {
                await prisma.enrollment.delete({
                    where: { id: existingEnrollment.id }
                });
            }
        }

        // Create Razorpay order
        let razorpayOrder;
        try {
            razorpayOrder = await createRazorpayOrder({
                amount: course.price,
                currency: "INR",
                receipt: `enrollment_${Date.now()}`,
                notes: {
                    courseId: course.id,
                    userId: session.user.id,
                },
            });
        } catch (razorpayError) {
            console.error("Razorpay order creation failed:", razorpayError);
            // Return specific error message for Razorpay configuration issues
            const errorMessage = razorpayError instanceof Error
                ? razorpayError.message
                : "Failed to create payment order";

            return NextResponse.json<ApiResponse>(
                { success: false, message: errorMessage },
                { status: 500 }
            );
        }

        // Create enrollment record with PENDING status
        const enrollment = await prisma.enrollment.create({
            data: {
                userId: session.user.id,
                courseId: course.id,
                status: "PENDING",
                amountPaid: 0, // Will be updated after payment verification
                razorpayOrderId: razorpayOrder.id,
            },
        });

        // Return order details
        const responseData: RazorpayOrderResponse = {
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            enrollmentId: enrollment.id,
        };

        return NextResponse.json<ApiResponse<RazorpayOrderResponse>>(
            {
                success: true,
                message: "Order created successfully",
                data: responseData,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Enrollment creation error:", error);

        // Log detailed error information
        if (error instanceof Error) {
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        }

        return NextResponse.json<ApiResponse>(
            { success: false, message: "Failed to create enrollment. Please try again." },
            { status: 500 }
        );
    }
}
