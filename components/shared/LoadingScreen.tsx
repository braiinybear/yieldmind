"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

import { useLoadingStore } from "@/zustand/stores/loading-store";

export default function LoadingScreen() {
    const containerRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const setAppLoaded = useLoadingStore((state) => state.setAppLoaded);

    useEffect(() => {
        // Prevent scrolling while loading
        document.body.style.overflow = "hidden";

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    document.body.style.overflow = "auto";
                    setIsLoaded(true);
                    setAppLoaded(true);
                }
            });

            // Initial State
            gsap.set(logoRef.current, { y: 30, opacity: 0, scale: 0.9 });
            gsap.set(textRef.current, { y: 20, opacity: 0 });
            gsap.set(progressRef.current, { scaleX: 0 });

            // Counter Object for animation
            const counter = { value: 0 };

            // Animation Sequence
            tl
                // 1. Logo & Text Entrance
                .to(logoRef.current, {
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    duration: 1.2,
                    ease: "power4.out"
                })
                .to(textRef.current, {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out"
                }, "-=0.8")

                // 2. Progress Bar & Counter
                .to(progressRef.current, {
                    scaleX: 1,
                    duration: 1.5,
                    ease: "power2.inOut"
                }, "-=0.5")
                .to(counter, {
                    value: 100,
                    duration: 1.5,
                    ease: "power2.inOut",
                    onUpdate: () => {
                        if (counterRef.current) {
                            counterRef.current.innerText = Math.round(counter.value).toString();
                        }
                    }
                }, "<") // Sync with progress bar

                // 3. Exit Animation
                .to([logoRef.current, textRef.current, progressRef.current, counterRef.current, ".loading-extras"], {
                    opacity: 0,
                    y: -30,
                    duration: 0.6,
                    ease: "back.in(1.7)",
                    delay: 0.2
                })
                .to(containerRef.current, {
                    yPercent: -100,
                    duration: 1,
                    ease: "power4.inOut"
                });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    if (isLoaded) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-9999 bg-[#050C16] flex items-center justify-center overflow-hidden"
        >
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none loading-extras opacity-0 animate-in fade-in duration-1000" />

            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-premium opacity-10 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
                {/* Logo Wrapper */}
                <div ref={logoRef} className="relative w-32 h-32 mb-8 opacity-0">
                    <Image
                        src="/logo.png"
                        alt="YieldMind Academy"
                        fill
                        className="object-contain drop-shadow-2xl"
                        priority
                    />
                </div>

                {/* Text */}
                <div ref={textRef} className="text-center space-y-3 opacity-0">
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        YieldMind <span className="text-gold-gradient">Academy</span>
                    </h1>
                    <p className="text-primary/60 font-accent text-sm uppercase tracking-[0.3em]">
                        Empowering Creators
                    </p>
                </div>

                {/* Progress Container */}
                <div className="mt-12 flex flex-col items-center gap-4 w-64 loading-extras">
                    {/* Bar */}
                    <div className="w-full h-0.5 bg-primary/10 rounded-full overflow-hidden">
                        <div
                            ref={progressRef}
                            className="h-full w-full bg-gold-gradient origin-left scale-x-0 shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                        />
                    </div>

                    {/* Percentage */}
                    <div className="font-mono text-xs text-primary/80">
                        <span ref={counterRef}>0</span>%
                    </div>
                </div>
            </div>
        </div>
    );
}
