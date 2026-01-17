"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface CancelEnrollmentButtonProps {
    enrollmentId: string;
}

export function CancelEnrollmentButton({ enrollmentId }: CancelEnrollmentButtonProps) {
    const [isCancelling, setIsCancelling] = useState(false);
    const router = useRouter();

    const handleCancel = async () => {
        if (!confirm("Are you sure you want to cancel this enrollment? This action cannot be undone.")) {
            return;
        }

        setIsCancelling(true);

        try {
            const response = await fetch(`/api/enrollment/${enrollmentId}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Enrollment Cancelled", {
                    description: "You can enroll again from the course page.",
                });
                router.refresh();
            } else {
                throw new Error(data.message || "Failed to cancel enrollment");
            }
        } catch (error) {
            console.error("Cancel error:", error);
            toast.error("Failed to Cancel", {
                description: error instanceof Error ? error.message : "Please try again",
            });
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <Button
            onClick={handleCancel}
            disabled={isCancelling}
            variant="ghost"
            size="sm"
            className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
            <X className="h-4 w-4" />
            {isCancelling ? "Cancelling..." : "Cancel Enrollment"}
        </Button>
    );
}
