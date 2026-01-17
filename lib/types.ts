import { Course, CourseModule, Lesson, Enrollment, User, CourseType, EnrollmentStatus } from "@prisma/client";

// ============================================
// COURSE TYPES
// ============================================

export type CourseWithModules = Course & {
    modules: CourseModule[];
};

export type CourseWithFullDetails = Course & {
    modules: (CourseModule & {
        lessons: Lesson[];
    })[];
};

export type CourseCardData = Pick<
    Course,
    "id" | "title" | "slug" | "thumbnail" | "price" | "duration" | "type"
>;

// ============================================
// ENROLLMENT TYPES
// ============================================

export type EnrollmentWithCourse = Enrollment & {
    Course: Course;
};

export type EnrollmentWithUser = Enrollment & {
    User: Pick<User, "id" | "name" | "email">;
};

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = void> {
    success: boolean;
    message: string;
    data?: T;
}

export interface RazorpayOrderResponse {
    orderId: string;
    amount: number;
    currency: string;
    enrollmentId: string;
}

export interface RazorpayVerificationPayload {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    enrollmentId: string;
}

// ============================================
// FORM TYPES
// ============================================

export interface EnrollmentFormData {
    courseId: string;
    userId: string;
}

// ============================================
// UTILITY TYPES
// ============================================

export type CourseTypeVariant = CourseType;
export type EnrollmentStatusVariant = EnrollmentStatus;

// Re-export Prisma types for convenience
export type { Course, CourseModule, Lesson, Enrollment, User, CourseType, EnrollmentStatus };
