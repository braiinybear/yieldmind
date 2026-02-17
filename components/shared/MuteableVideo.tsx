"use client";
import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function MuteableVideo({ src, poster }: { src: string; poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    setMuted((m) => {
      const newMuted = !m;
      if (videoRef.current) videoRef.current.muted = newMuted;
      return newMuted;
    });
  };

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        loop
        muted={muted}
        className="w-full h-full object-fill"
      />
      <button
        type="button"
        onClick={toggleMute}
        className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 z-10 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label={muted ? "Unmute video" : "Mute video"}
      >
        {muted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
      </button>
    </div>
  );
}