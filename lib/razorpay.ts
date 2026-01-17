import Razorpay from "razorpay";
import crypto from "crypto";

// ============================================
// RAZORPAY CONFIGURATION
// ============================================

// Check if Razorpay credentials are configured
const isRazorpayConfigured = Boolean(
    process.env.RAZORPAY_KEY_ID &&
    process.env.RAZORPAY_KEY_SECRET &&
    process.env.RAZORPAY_KEY_ID !== "your_razorpay_key_id_here"
);

export const razorpayInstance = isRazorpayConfigured
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })
    : null;

// ============================================
// ORDER CREATION
// ============================================

export interface CreateOrderParams {
    amount: number; // Amount in rupees (will be converted to paise)
    currency?: string;
    receipt: string;
    notes?: Record<string, string>;
}

export interface RazorpayOrder {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
    attempts: number;
    notes: Record<string, string>;
    created_at: number;
}

/**
 * Create a Razorpay order
 * @param params - Order creation parameters
 * @returns Razorpay order object
 */
export async function createRazorpayOrder(
    params: CreateOrderParams
): Promise<RazorpayOrder> {
    if (!razorpayInstance) {
        throw new Error(
            "Razorpay is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your environment variables."
        );
    }

    try {
        const order = await razorpayInstance.orders.create({
            amount: params.amount * 100, // Convert to paise
            currency: params.currency || "INR",
            receipt: params.receipt,
            notes: params.notes || {},
        });

        return order as RazorpayOrder;
    } catch (error) {
        console.error("Razorpay order creation failed:", error);
        throw new Error("Failed to create payment order");
    }
}

// ============================================
// PAYMENT VERIFICATION
// ============================================

export interface VerifyPaymentParams {
    orderId: string;
    paymentId: string;
    signature: string;
}

/**
 * Verify Razorpay payment signature
 * @param params - Payment verification parameters
 * @returns True if signature is valid, false otherwise
 */
export function verifyRazorpaySignature(params: VerifyPaymentParams): boolean {
    try {
        const { orderId, paymentId, signature } = params;

        // Create the expected signature
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(`${orderId}|${paymentId}`)
            .digest("hex");

        // Compare signatures
        return generatedSignature === signature;
    } catch (error) {
        console.error("Razorpay signature verification failed:", error);
        return false;
    }
}

// ============================================
// CLIENT-SIDE HELPERS
// ============================================

export interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    theme?: {
        color?: string;
    };
    handler: (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
    }) => void;
}

/**
 * Load Razorpay script dynamically
 * @returns Promise that resolves when script is loaded
 */
export function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
        // Check if script already loaded
        if (typeof window !== "undefined" && (window as Window & { Razorpay?: unknown }).Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}
