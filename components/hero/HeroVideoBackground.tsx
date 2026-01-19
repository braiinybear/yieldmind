"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const videos = [
    "/videos/1.mp4",
    "/videos/2.mp4",
    "/videos/3.mp4",
    "/videos/4.mp4",
];

export function HeroVideoBackground() {
    const [currentIdx, setCurrentIdx] = useState(0);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    useEffect(() => {
        // Ensure the current video is playing
        const currentVideo = videoRefs.current[currentIdx];
        if (currentVideo) {
            currentVideo.play().catch((e) => {
                console.warn("Video autoplay blocked or failed:", e);
            });
        }

        // Preload next video to ensure seamless transition
        const nextIdx = (currentIdx + 1) % videos.length;
        const nextVideo = videoRefs.current[nextIdx];
        if (nextVideo) {
            nextVideo.load();
        }
    }, [currentIdx]);

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
            {videos.map((src, idx) => (
                <video
                    key={src}
                    ref={(el) => {
                        if (el) videoRefs.current[idx] = el;
                    }}
                    src={src}
                    className={cn(
                        "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out",
                        idx === currentIdx ? "opacity-100 z-10" : "opacity-0 z-0"
                    )}
                    preload="auto"
                    muted
                    playsInline
                    onEnded={() => {
                        // Move to next video
                        setCurrentIdx((prev) => (prev + 1) % videos.length);
                    }}
                />
            ))}

            {/* Overlay for text readability - slightly darker than pure gradient to ensure video visibility but readable text */}
            <div className="absolute inset-0 bg-background/60 z-20" />
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-background/40 z-20" />
        </div>
    );
}
