"use client";

import { useEffect, useRef, ReactNode } from "react";
import { scrollAnimation } from "@/lib/gsap-animations";
import { useLoadingStore } from "@/zustand/stores/loading-store";

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
    const isAppLoaded = useLoadingStore((state) => state.isAppLoaded);

    useEffect(() => {
        if (sectionRef.current && isAppLoaded) {
            scrollAnimation(sectionRef.current, { delay });
        }
    }, [delay, isAppLoaded]);

    return (
        <div ref={sectionRef} className={className} data-animate style={{ opacity: 0 }}>
            {children}
        </div>
    );
}
