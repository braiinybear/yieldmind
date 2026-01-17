"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

interface VerifyPaymentButtonProps {
    enrollmentId: string;
}

export function VerifyPaymentButton({ enrollmentId }: VerifyPaymentButtonProps) {
    const [isVerifying, setIsVerifying] = useState(false);
    const router = useRouter();

    const handleVerify = async () => {
        setIsVerifying(true);

        try {
            const response = await fetch("/api/enrollment/reconcile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ enrollmentId }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Payment Verified!", {
                    description: data.message,
                });
                router.refresh();
            } else {
                toast.error("Verification Failed", {
                    description: data.message || "Could not verify payment. Please contact support.",
                });
            }
        } catch (error) {
            console.error("Verification error:", error);
            toast.error("Error", {
                description: "Failed to verify payment. Please try again.",
            });
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <Button
            onClick={handleVerify}
            disabled={isVerifying}
            variant="default"
            className="gap-2"
        >
            <RefreshCw className={`h-4 w-4 ${isVerifying ? 'animate-spin' : ''}`} />
            {isVerifying ? "Verifying..." : "Verify Payment"}
        </Button>
    );
}
