import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";

/**
 * DELETE /api/enrollment/[id]
 * Deletes a PENDING enrollment (allows user to retry)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        // Fetch enrollment
        const enrollment = await prisma.enrollment.findUnique({
            where: { id },
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

        // Only allow deleting PENDING enrollments
        if (enrollment.status !== "PENDING") {
            return NextResponse.json<ApiResponse>(
                {
                    success: false,
                    message: "Cannot delete active or completed enrollments"
                },
                { status: 400 }
            );
        }

        // Delete the enrollment
        await prisma.enrollment.delete({
            where: { id },
        });

        return NextResponse.json<ApiResponse>(
            { success: true, message: "Enrollment cancelled successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Delete enrollment error:", error);
        return NextResponse.json<ApiResponse>(
            { success: false, message: "Failed to cancel enrollment" },
            { status: 500 }
        );
    }
}
