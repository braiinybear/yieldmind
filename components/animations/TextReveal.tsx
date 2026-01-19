"use client";

import { useEffect, useRef, ReactNode } from "react";
import { textReveal } from "@/lib/gsap-animations";
import { useLoadingStore } from "@/zustand/stores/loading-store";

interface TextRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

/**
 * Text Reveal Component
 * Animated text reveal effect
 */
export function TextReveal({
    children,
    className = "",
    delay = 0
}: TextRevealProps) {
    const textRef = useRef<HTMLDivElement>(null);
    const isAppLoaded = useLoadingStore((state) => state.isAppLoaded);

    useEffect(() => {
        if (textRef.current && isAppLoaded) {
            setTimeout(() => {
                if (textRef.current) {
                    textReveal(textRef.current);
                }
            }, delay * 1000);
        }
    }, [delay, isAppLoaded]);

    return (
        <div ref={textRef} className={className} style={{ opacity: 0 }}>
            {children}
        </div>
    );
}
