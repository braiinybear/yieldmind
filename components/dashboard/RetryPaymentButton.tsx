"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";
import { loadRazorpayScript } from "@/lib/razorpay";

interface RetryPaymentButtonProps {
    enrollmentId: string;
    courseId: string;
    courseName: string;
    remainingAmount: number;
    coursePrice: number;
}

export function RetryPaymentButton({
    enrollmentId,
    courseId,
    courseName,
    remainingAmount,
    coursePrice
}: RetryPaymentButtonProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();

    const handleRetryPayment = async () => {
        setIsProcessing(true);

        try {
            // Don't delete old enrollment for partial payments
            const shouldDeleteOld = remainingAmount === 0;

            if (shouldDeleteOld) {
                const deleteResponse = await fetch(`/api/enrollment/${enrollmentId}`, {
                    method: "DELETE",
                });

                if (!deleteResponse.ok) {
                    throw new Error("Failed to clear previous enrollment");
                }
            }

            // Load Razorpay script
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                throw new Error("Failed to load payment gateway");
            }

            // For partial payment, create order with remaining amount
            // For full retry, create new enrollment
            let orderId, amount, currency, targetEnrollmentId;

            const hasPartialPayment = remainingAmount > 0 && remainingAmount < coursePrice;

            if (hasPartialPayment) {
                // Partial payment - create order for remaining amount only
                const partialResponse = await fetch("/api/enrollment/partial-payment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        enrollmentId,
                        amount: remainingAmount
                    }),
                });

                const partialResult = await partialResponse.json();
                if (!partialResponse.ok) {
                    throw new Error(partialResult.message || "Failed to create partial payment order");
                }

                ({ orderId, amount, currency } = partialResult.data);
                targetEnrollmentId = enrollmentId; // Use existing enrollment
            } else {
                // Full payment - create new enrollment
                const createResponse = await fetch("/api/enrollment/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ courseId }),
                });

                const result = await createResponse.json();
                if (!createResponse.ok) {
                    throw new Error(result.message || "Failed to create order");
                }

                ({ orderId, amount, currency, enrollmentId: targetEnrollmentId } = result.data);
            }

            // Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: amount,
                currency: currency,
                name: "YieldMind Academy",
                description: `Enrollment for ${courseName}`,
                order_id: orderId,
                handler: async function (response: any) {
                    try {
                        const verifyResponse = await fetch("/api/enrollment/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                enrollmentId: targetEnrollmentId,
                            }),
                        });

                        const verifyData = await verifyResponse.json();

                        if (verifyResponse.ok) {
                            toast.success("Payment Successful!", {
                                description: "Your enrollment is now active.",
                            });
                            router.refresh();
                        } else {
                            throw new Error(verifyData.message || "Payment verification failed");
                        }
                    } catch (error) {
                        toast.error("Verification Failed", {
                            description: "Please contact support if amount was deducted.",
                        });
                    } finally {
                        setIsProcessing(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        toast.info("Payment Cancelled");
                        setIsProcessing(false);
                        router.refresh();
                    }
                },
                theme: {
                    color: "#D4AF37",
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Retry payment error:", error);
            toast.error("Failed to Retry Payment", {
                description: error instanceof Error ? error.message : "Please try again",
            });
            setIsProcessing(false);
        }
    };

    return (
        <Button
            onClick={handleRetryPayment}
            disabled={isProcessing}
            variant="default"
            className="gap-2"
        >
            <CreditCard className="h-4 w-4" />
            {isProcessing ? "Processing..." : "Retry Payment"}
        </Button>
    );
}
