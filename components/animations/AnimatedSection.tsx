"use client";

import { useEffect, useRef, ReactNode } from "react";
import { scrollAnimation } from "@/lib/gsap-animations";

interface AnimatedSectionProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

/**
 * Animated Section Component
 * Wraps content with scroll-triggered fade-in animation
 */
export function AnimatedSection({
    children,
    className = "",
    delay = 0
}: AnimatedSectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (sectionRef.current) {
            scrollAnimation(sectionRef.current, { delay });
        }
    }, [delay]);

    return (
        <div ref={sectionRef} className={className} data-animate>
            {children}
        </div>
    );
}
