/**
 * Utility functions for formatting data
 * All functions are pure and type-safe
 */

// ============================================
// CURRENCY FORMATTING
// ============================================

/**
 * Format a number as Indian Rupees (₹)
 * @param amount - The amount to format
 * @returns Formatted string like "₹15,000"
 */
export function formatPrice(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format a number as compact Indian Rupees
 * @param amount - The amount to format
 * @returns Formatted string like "₹15K" or "₹1.5L"
 */
export function formatPriceCompact(amount: number): string {
    if (amount >= 100000) {
        return `₹${(amount / 100000).toFixed(1)}L`;
    }
    if (amount >= 1000) {
        return `₹${(amount / 1000).toFixed(0)}K`;
    }
    return formatPrice(amount);
}

// ============================================
// DATE FORMATTING
// ============================================

/**
 * Format a date to Indian locale
 * @param date - The date to format
 * @returns Formatted string like "17 Jan 2026"
 */
export function formatDate(date: Date | string | null): string {
    if (!date) return "Date TBA";

    const dateObj = typeof date === "string" ? new Date(date) : date;

    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(dateObj);
}

/**
 * Format a date to relative time
 * @param date - The date to format
 * @returns Formatted string like "2 days ago" or "in 3 months"
 */
export function formatRelativeDate(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffInMs = dateObj.getTime() - now.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Tomorrow";
    if (diffInDays === -1) return "Yesterday";
    if (diffInDays > 0 && diffInDays < 30) return `in ${diffInDays} days`;
    if (diffInDays < 0 && diffInDays > -30) return `${Math.abs(diffInDays)} days ago`;

    return formatDate(dateObj);
}

// ============================================
// TEXT FORMATTING
// ============================================

/**
 * Truncate text to a maximum length
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
}

/**
 * Convert a string to title case
 * @param text - The text to convert
 * @returns Title cased text
 */
export function toTitleCase(text: string): string {
    return text
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

// ============================================
// SLUG FORMATTING
// ============================================

/**
 * Convert a title to a URL-friendly slug
 * @param title - The title to convert
 * @returns URL-friendly slug
 */
export function createSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
}
