"use client";
import { useState } from "react";
import { GenerationRequest, generateMusic } from "@/utils/api";
import { Play, Loader2 } from "lucide-react";

interface ControlPanelProps {
    onJobCreated: (jobId: string) => void;
}

export default function ControlPanel({ onJobCreated }: ControlPanelProps) {
    const [prompt, setPrompt] = useState("upbeat techno with synth leads");
    const [duration, setDuration] = useState(60);
    const [loading, setLoading] = useState(false);

    async function handleGenerate() {
        setLoading(true);
        try {
            const req: GenerationRequest = {
                prompt,
                duration,
                infer_steps: 60
            };
            const job = await generateMusic(req);
            onJobCreated(job.job_id);
        } catch (e) {
            alert("Failed: " + e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-80 bg-card border-l border-border h-full flex flex-col p-4 gap-6 shrink-0 z-20 shadow-xl">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Parameters</h2>

            <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prompt</label>
                <textarea
                    className="w-full h-32 bg-input border border-border rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground/50 resize-none"
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="Describe your music..."
                />
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Duration</label>
                    <span className="text-xs font-mono text-primary">{duration}s</span>
                </div>
                <input
                    type="range" min="10" max="240"
                    value={duration}
                    onChange={e => setDuration(Number(e.target.value))}
                    className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
            </div>

            <div className="flex-1" />

            <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-primary text-primary-foreground h-12 rounded-md font-bold hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Play className="fill-current w-5 h-5" />}
                {loading ? "Generating..." : "Generate Track"}
            </button>
        </div>
    );
}
