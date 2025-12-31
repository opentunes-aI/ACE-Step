"use client";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { useStudioStore } from "@/utils/store";
import { Play, Pause, AlertCircle } from "lucide-react";

export default function WaveformVisualizer() {
    const containerRef = useRef<HTMLDivElement>(null);
    const ws = useRef<WaveSurfer | null>(null);
    const { currentTrackUrl, currentTrackName } = useStudioStore();
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        ws.current = WaveSurfer.create({
            container: containerRef.current,
            waveColor: '#52525b', // zinc-600
            progressColor: '#f97316', // orange-500
            cursorColor: '#ffffff',
            barWidth: 3,
            barGap: 2,
            barRadius: 3,
            height: 200, // taller
            normalize: true,
            backend: 'WebAudio',
        });

        ws.current.on('play', () => setIsPlaying(true));
        ws.current.on('pause', () => setIsPlaying(false));
        ws.current.on('finish', () => setIsPlaying(false));
        ws.current.on('error', (e) => setError(e.toString()));

        return () => {
            ws.current?.destroy();
        }
    }, []);

    useEffect(() => {
        if (currentTrackUrl && ws.current) {
            setError(null);
            ws.current.load(currentTrackUrl);
        }
    }, [currentTrackUrl]);

    function togglePlay() {
        if (ws.current) {
            ws.current.playPause();
        }
    }

    return (
        <div className="flex-1 bg-background relative flex flex-col items-center justify-center overflow-hidden">
            {/* Background Grid/Effect */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800 to-background" />

            {/* Info overlay */}
            <div className="z-10 absolute top-10 left-0 right-0 text-center">
                {currentTrackName ? (
                    <div className="inline-block px-4 py-2 bg-secondary/50 rounded-full border border-white/5 backdrop-blur-md">
                        <span className="text-muted-foreground text-xs font-mono uppercase mr-2">Now Playing</span>
                        <span className="text-foreground font-medium">{currentTrackName}</span>
                    </div>
                ) : (
                    <div className="text-muted-foreground/50 font-mono text-sm px-4 py-2 border border-dashed border-border rounded-full">
                        Select a track to visualize
                    </div>
                )}
                {error && (
                    <div className="mt-4 text-red-500 bg-red-500/10 px-4 py-2 rounded flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                )}
            </div>

            {/* Waveform Container */}
            <div ref={containerRef} className="w-full px-12 z-10" />

            {/* Controls */}
            {currentTrackUrl && (
                <div className="absolute bottom-10 z-20">
                    <button
                        onClick={togglePlay}
                        className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-105 transition-all active:scale-95"
                    >
                        {isPlaying ? <Pause className="fill-current w-6 h-6" /> : <Play className="fill-current w-6 h-6 ml-1" />}
                    </button>
                </div>
            )}
        </div>
    );
}
