"use client";
import { useState } from "react";
import { GenerationRequest, generateMusic } from "@/utils/api";
import { useStudioStore, MusicFormat } from "@/utils/store";
import { Play, Loader2, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";

const GENRES: Record<string, string> = {
    "Modern Pop": "pop, synth, drums, guitar, 120 bpm, upbeat, catchy, vibrant, female vocals, polished vocals",
    "Rock": "rock, electric guitar, drums, bass, 130 bpm, energetic, rebellious, gritty, male vocals, raw vocals",
    "Hip Hop": "hip hop, 808 bass, hi-hats, synth, 90 bpm, bold, urban, intense, male vocals, rhythmic vocals",
    "Country": "country, acoustic guitar, steel guitar, fiddle, 100 bpm, heartfelt, rustic, warm, male vocals, twangy vocals",
    "EDM": "edm, synth, bass, kick drum, 128 bpm, euphoric, pulsating, energetic, instrumental",
    "Reggae": "reggae, guitar, bass, drums, 80 bpm, chill, soulful, positive, male vocals, smooth vocals",
    "Classical": "classical, orchestral, strings, piano, 60 bpm, elegant, emotive, timeless, instrumental",
    "Jazz": "jazz, saxophone, piano, double bass, 110 bpm, smooth, improvisational, soulful, male vocals, crooning vocals",
    "Metal": "metal, electric guitar, double kick drum, bass, 160 bpm, aggressive, intense, heavy, male vocals, screamed vocals",
    "R&B": "r&b, synth, bass, drums, 85 bpm, sultry, groovy, romantic, female vocals, silky vocals"
};

interface ControlPanelProps {
    onJobCreated: (jobId: string) => void;
}

export default function ControlPanel({ onJobCreated }: ControlPanelProps) {
    // Global State
    const {
        prompt, setPrompt,
        lyrics, setLyrics,
        duration, setDuration,
        format, setFormat,
        seed, setSeed,
        steps, setSteps,
        cfgScale, setCfgScale
    } = useStudioStore();

    const [loading, setLoading] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    async function handleGenerate() {
        setLoading(true);
        try {
            const req: GenerationRequest = {
                prompt,
                lyrics,
                duration,
                infer_steps: steps,
                guidance_scale: cfgScale,
                seed: seed,
                format,
                cfg_type: "apg", // hardcoded default for now
                scheduler_type: "euler"
            };
            const job = await generateMusic(req);
            onJobCreated(job.job_id);
        } catch (e) {
            alert("Failed: " + e);
        } finally {
            setLoading(false);
        }
    }

    function handleGenreChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const val = e.target.value;
        if (val && GENRES[val]) {
            setPrompt(GENRES[val]);
        }
    }

    return (
        <div className="w-96 bg-card border-l border-border h-full flex flex-col p-4 gap-4 shrink-0 z-20 shadow-xl overflow-y-auto">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Studio Controls
            </h2>

            {/* Genre Preset */}
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Style Preset</label>
                <select
                    className="w-full bg-input border border-border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                    onChange={handleGenreChange}
                    defaultValue=""
                >
                    <option value="" disabled>Select a Genre...</option>
                    {Object.keys(GENRES).map(k => (
                        <option key={k} value={k}>{k}</option>
                    ))}
                </select>
            </div>

            {/* Prompt */}
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prompt</label>
                <textarea
                    className="w-full h-24 bg-input border border-border rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground/50 resize-none"
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="Describe style, instruments, mood..."
                />
            </div>

            {/* Lyrics */}
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lyrics (Optional)</label>
                <textarea
                    className="w-full h-32 bg-input border border-border rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground/50 resize-none font-mono"
                    value={lyrics}
                    onChange={e => setLyrics(e.target.value)}
                    placeholder="[verse]&#10;Line 1...&#10;Line 2..."
                />
            </div>

            {/* Duration */}
            <div className="space-y-2 pt-2">
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

            {/* Advanced Toggle */}
            <div className="pt-2 border-t border-border">
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground py-2"
                >
                    <span>Advanced Settings</span>
                    {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showAdvanced && (
                    <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">

                        {/* Steps */}
                        <div className="space-y-1">
                            <div className="flex justify-between">
                                <label className="text-xs text-muted-foreground">Inference Steps</label>
                                <span className="text-xs font-mono">{steps}</span>
                            </div>
                            <input
                                type="range" min="10" max="200" step="1"
                                value={steps}
                                onChange={e => setSteps(Number(e.target.value))}
                                className="w-full accent-primary h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        {/* CFG */}
                        <div className="space-y-1">
                            <div className="flex justify-between">
                                <label className="text-xs text-muted-foreground">Guidance Scale</label>
                                <span className="text-xs font-mono">{cfgScale}</span>
                            </div>
                            <input
                                type="range" min="1" max="30" step="0.5"
                                value={cfgScale}
                                onChange={e => setCfgScale(Number(e.target.value))}
                                className="w-full accent-primary h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        {/* Seed */}
                        <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Seed (Empty = Random)</label>
                            <input
                                type="number"
                                className="w-full bg-input border border-border rounded p-2 text-xs"
                                placeholder="Random"
                                value={seed || ""}
                                onChange={e => setSeed(e.target.value ? Number(e.target.value) : null)}
                            />
                        </div>

                        {/* Format */}
                        <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Format</label>
                            <select
                                className="w-full bg-input border border-border rounded p-2 text-xs"
                                value={format}
                                onChange={e => setFormat(e.target.value as MusicFormat)}
                            >
                                <option value="wav">WAV (High Quality)</option>
                                <option value="mp3">MP3</option>
                                <option value="flac">FLAC</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>


            <div className="flex-1" />

            <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-primary text-primary-foreground h-12 rounded-md font-bold hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none mt-4"
            >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Play className="fill-current w-5 h-5" />}
                {loading ? "Generating..." : "Generate Track"}
            </button>
        </div>
    );
}
