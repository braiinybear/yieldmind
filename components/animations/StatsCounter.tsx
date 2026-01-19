"use client";

import { useEffect, useRef } from "react";
import { animateCounter } from "@/lib/gsap-animations";
import { useLoadingStore } from "@/zustand/stores/loading-store";

interface StatsCounterProps {
    endValue: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    className?: string;
}

/**
 * Stats Counter Component
 * Animated number counter with GSAP
 */
export function StatsCounter({
    endValue,
    duration = 2,
    suffix = "",
    prefix = "",
    className = "text-[2.45rem] tabular-nums inline-block leading-normal"
}: StatsCounterProps) {
    const counterRef = useRef<HTMLSpanElement>(null);
    const isAppLoaded = useLoadingStore((state) => state.isAppLoaded);

    useEffect(() => {
        if (counterRef.current && isAppLoaded) {
            // Set initial value
            counterRef.current.textContent = "0";

            // Animate when in viewport
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting && counterRef.current) {
                            animateCounter(counterRef.current, endValue, duration);
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.5 }
            );

            observer.observe(counterRef.current);

            return () => observer.disconnect();
        }
    }, [endValue, duration, isAppLoaded]);

    return (
        <span className={className}>
            {prefix}
            <span ref={counterRef}>0</span>
            {suffix}
        </span>
    );
}
