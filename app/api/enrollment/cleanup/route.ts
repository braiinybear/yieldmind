import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * DELETE /api/enrollment/cleanup
 * Removes stale PENDING enrollments (older than 24 hours)
 * Can be called by a cron job or manually
 */
export async function DELETE(request: NextRequest) {
    try {
        // Calculate 24 hours ago
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        // Delete old PENDING enrollments
        const result = await prisma.enrollment.deleteMany({
            where: {
                status: "PENDING",
                enrolledAt: {
                    lt: twentyFourHoursAgo
                }
            }
        });

        return NextResponse.json({
            success: true,
            message: `Cleaned up ${result.count} stale enrollments`,
            count: result.count
        });

    } catch (error) {
        console.error("Cleanup error:", error);
        return NextResponse.json(
            { success: false, message: "Cleanup failed" },
            { status: 500 }
        );
    }
}
