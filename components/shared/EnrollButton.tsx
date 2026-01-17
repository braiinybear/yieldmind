"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loadRazorpayScript, RazorpayOptions } from "@/lib/razorpay";
import { Loader2 } from "lucide-react";

interface EnrollButtonProps {
    courseId: string;
    coursePrice: number;
}

/**
 * EnrollButton component
 * Handles course enrollment with Razorpay payment integration
 */
export function EnrollButton({ courseId, coursePrice }: EnrollButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleEnroll = async () => {
        try {
            setIsLoading(true);

            // Load Razorpay script
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                toast.error("Failed to load payment gateway. Please try again.");
                return;
            }

            // Create order
            const createResponse = await fetch("/api/enrollment/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId }),
            });

            if (!createResponse.ok) {
                const error = await createResponse.json();
                toast.error(error.message || "Failed to create enrollment");
                return;
            }

            const orderData = await createResponse.json();

            // Initialize Razorpay
            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: orderData.data.amount,
                currency: orderData.data.currency,
                name: "YieldMind Academy",
                description: "Course Enrollment Fee",
                order_id: orderData.data.orderId,
                prefill: {
                    name: "",
                    email: "",
                    contact: "",
                },
                theme: {
                    color: "#0EA5E9", // Primary color
                },
                handler: async (response) => {
                    // Verify payment
                    await verifyPayment({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        enrollmentId: orderData.data.enrollmentId,
                    });
                },
            };

            // Open Razorpay checkout
            interface RazorpayInstance {
                open: () => void;
            }

            interface WindowWithRazorpay extends Window {
                Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
            }

            const razorpay = new (window as unknown as WindowWithRazorpay).Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.error("Enrollment error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const verifyPayment = async (paymentData: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
        enrollmentId: string;
    }) => {
        try {
            const verifyResponse = await fetch("/api/enrollment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(paymentData),
            });

            if (!verifyResponse.ok) {
                toast.error("Payment verification failed");
                return;
            }

            const result = await verifyResponse.json();

            if (result.success) {
                toast.success("🎉 Enrollment successful! Welcome to the course.");
                router.push("/dashboard");
                router.refresh();
            } else {
                toast.error(result.message || "Payment verification failed");
            }
        } catch (error) {
            console.error("Verification error:", error);
            toast.error("Failed to verify payment");
        }
    };

    return (
        <Button
            onClick={handleEnroll}
            disabled={isLoading}
            className="w-full h-12 text-lg font-semibold"
            size="lg"
        >
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                </>
            ) : (
                "Enroll Now"
            )}
        </Button>
    );
}
