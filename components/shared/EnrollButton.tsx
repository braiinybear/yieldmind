"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { loadRazorpayScript } from "@/lib/razorpay";

interface EnrollButtonProps {
    courseId: string;
    price: number;
    courseName: string;
}

export default function EnrollButton({ courseId, price, courseName }: EnrollButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    const handlePayment = async () => {
        setIsLoading(true);

        try {
            // 1. Load Razorpay Script
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                throw new Error("Failed to load Razorpay. Please check your internet connection.");
            }

            // 2. Create Order
            const response = await fetch("/api/enrollment/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to create order");
            }

            // Verify we have the data we need
            if (!result.data || !result.data.orderId) {
                throw new Error("Invalid response from server");
            }

            const { orderId, amount, currency, enrollmentId } = result.data;

            // 3. Initialize Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: amount,
                currency: currency,
                name: "YieldMind Academy",
                description: `Enrollment for ${courseName}`,
                order_id: orderId,
                handler: async function (response: any) {
                    try {
                        // 4. Verify Payment
                        const verifyResponse = await fetch("/api/enrollment/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                enrollmentId: enrollmentId, // Pass the enrollmentId
                            }),
                        });

                        const verifyData = await verifyResponse.json();

                        if (verifyResponse.ok) {
                            toast.success("Enrollment Successful!", {
                                description: "Welcome to the course. Redirecting to dashboard...",
                                duration: 5000,
                            });
                            router.push("/dashboard");
                            router.refresh();
                        } else {
                            throw new Error(verifyData.message || "Payment verification failed");
                        }
                    } catch (error) {
                        toast.error("Payment Verification Failed", {
                            description: "Please contact support if amount was deducted.",
                        });
                        console.error(error);
                    } finally {
                        setIsLoading(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        // User closed the payment modal
                        toast.info("Payment Cancelled", {
                            description: "You can try again when ready.",
                        });
                        setIsLoading(false);
                        router.refresh(); // Refresh to clear pending enrollment
                    }
                },
                prefill: {
                    name: session?.user?.name || "",
                    email: session?.user?.email || "",
                },
                theme: {
                    color: "#D4AF37", // Luxury Gold
                },
            };

            // Check if Razorpay is available
            if (typeof window === "undefined" || !(window as any).Razorpay) {
                throw new Error("Razorpay SDK not loaded");
            }

            const rzp1 = new (window as any).Razorpay(options);

            // Handle Razorpay errors
            rzp1.on('payment.failed', function (response: any) {
                toast.error("Payment Failed", {
                    description: response.error.description || "Please try again",
                });
                setIsLoading(false);
                router.refresh();
            });

            rzp1.open();

        } catch (error) {
            console.error("Enrollment Error:", error);
            toast.error("Enrollment Failed", {
                description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
            });
            setIsLoading(false);
            router.refresh(); // Refresh to clear any pending enrollment
        }
    };

    return (
        <Button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full btn-gold h-14 text-lg font-bold rounded-none uppercase tracking-wider shadow-gold relative overflow-hidden"
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    <span>Processing...</span>
                </div>
            ) : (
                "Enroll Now"
            )}
        </Button>
    );
}
