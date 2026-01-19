"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

import { useLoadingStore } from "@/zustand/stores/loading-store";

export default function LoadingScreen() {
    const containerRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const textWrapperRef = useRef<HTMLDivElement>(null);
    const capabilitiesRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);
    const bgOrbsRef = useRef<HTMLDivElement>(null);

    const [isLoaded, setIsLoaded] = useState(false);
    const setAppLoaded = useLoadingStore((state) => state.setAppLoaded);

    useEffect(() => {
        document.body.style.overflow = "hidden";

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    document.body.style.overflow = "auto";
                    setIsLoaded(true);
                    setAppLoaded(true);
                }
            });

            // Initial Setup
            gsap.set(logoRef.current, { scale: 3, filter: "blur(20px)", opacity: 0, force3D: true });
            gsap.set(textWrapperRef.current, { y: 50, opacity: 0 });
            gsap.set(capabilitiesRef.current?.children || [], { y: 20, opacity: 0 });
            gsap.set(progressRef.current, { scaleX: 0 });

            // Background Animation (Continuous)
            gsap.to(".orb", {
                y: "random(-50, 50)",
                x: "random(-50, 50)",
                scale: "random(0.8, 1.2)",
                duration: "random(3, 5)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            const counter = { value: 0 };

            tl
                // 1. Cinematic Logo Focus Pull
                .to(logoRef.current, {
                    scale: 1,
                    filter: "blur(0px)",
                    opacity: 1,
                    duration: 1.5,
                    ease: "expo.out",
                })

                // 2. Text Reveal
                .to(textWrapperRef.current, {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out"
                }, "-=1")

                // 3. Capabilities Stagger
                .to(capabilitiesRef.current?.children || [], {
                    y: 0,
                    opacity: 1,
                    stagger: 0.2,
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=0.8")

                // 4. Progress & Counter
                .to(".progress-area", {
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out"
                }, "-=1.5")
                .to(progressRef.current, {
                    scaleX: 1,
                    duration: 2,
                    ease: "expo.inOut"
                }, "<")
                .to(counter, {
                    value: 100,
                    duration: 2,
                    ease: "expo.inOut",
                    onUpdate: () => {
                        if (counterRef.current) {
                            counterRef.current.innerText = Math.round(counter.value).toString();
                        }
                    }
                }, "<")

                // 5. Cinematic Exit
                .to([logoRef.current, textWrapperRef.current, capabilitiesRef.current, ".progress-area"], {
                    opacity: 0,
                    scale: 0.9,
                    filter: "blur(10px)",
                    duration: 0.8,
                    ease: "power2.in",
                    stagger: 0.05
                })
                .to(containerRef.current, {
                    yPercent: -100,
                    duration: 1.2,
                    ease: "power4.inOut"
                }, "-=0.4");

        }, containerRef);

        return () => ctx.revert();
    }, [setAppLoaded]);

    if (isLoaded) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-9999 bg-[#030712] flex flex-col items-center justify-center overflow-hidden"
            style={{ willChange: 'transform' }}
        >
            {/* Dynamic Background */}
            <div ref={bgOrbsRef} className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="orb absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full mix-blend-screen" />
                <div className="orb absolute bottom-[20%] right-[20%] w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen" />
                <div className="orb absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[150px] rounded-full mix-blend-screen" />
            </div>

            {/* Grid Pattern with Vignette */}
            <div className="absolute inset-0 bg-grid-premium opacity-[0.03]" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#030712]/50 to-[#030712]" />

            <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-4 min-h-screen pb-32">

                {/* Logo Section */}
                <div className="relative mb-12">
                    <div ref={logoRef} className="relative w-40 h-40 md:w-56 md:h-56 opacity-0">
                        <Image
                            src="/logo.png"
                            alt="YieldMind"
                            fill
                            className="object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                            priority
                        />
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent skew-x-12 translate-x-[-150%] animate-shine opacity-50" />
                    </div>
                </div>

                {/* Typography */}
                <div ref={textWrapperRef} className="text-center space-y-6 opacity-0">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white to-white/50">
                        YIELDMIND
                    </h1>
                    <div className="h-px w-24 mx-auto bg-linear-to-r from-transparent via-primary to-transparent opacity-50" />
                </div>

                {/* Rotating Capabilities */}
                <div ref={capabilitiesRef} className="flex gap-4 md:gap-8 mt-6 text-sm md:text-base font-accent uppercase tracking-[0.2em] text-primary/60 opacity-0">
                    <span>Learn</span>
                    <span className="text-primary/30">•</span>
                    <span>Grow</span>
                    <span className="text-primary/30">•</span>
                    <span>Succeed</span>
                </div>

                {/* Footer Progress */}
                <div className="progress-area absolute bottom-12 md:bottom-16 left-0 w-full flex flex-col items-center gap-4 opacity-0">
                    <div className="font-mono text-4xl md:text-6xl font-bold text-white/50 tabular-nums">
                        <span ref={counterRef}>0</span>%
                    </div>
                    <div className="w-full max-w-md h-px bg-white/5 relative overflow-hidden">
                        <div
                            ref={progressRef}
                            className="absolute inset-0 bg-gold-gradient shadow-[0_0_20px_rgba(212,175,55,0.5)]"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
