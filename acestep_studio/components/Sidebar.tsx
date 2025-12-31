"use client";
import { useEffect, useState } from "react";
import { getHistory } from "@/utils/api";
import { Music2, RefreshCw, FileAudio } from "lucide-react";
import { useStudioStore } from "@/utils/store";

export default function Sidebar() {
    const [files, setFiles] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const { setCurrentTrack, currentTrackName } = useStudioStore();

    async function load() {
        setLoading(true);
        try {
            const res = await getHistory();
            setFiles(res.files);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }

    useEffect(() => { load(); }, []);

    const API_BASE = "http://localhost:8000"; // Should match util/api

    return (
        <div className="w-64 bg-card border-r border-border h-full flex flex-col shrink-0 z-10">
            <div className="h-16 border-b border-border flex items-center justify-between px-4 shrink-0">
                <span className="font-bold text-sm tracking-tight text-foreground flex items-center gap-2">
                    <Music2 className="w-4 h-4 text-primary" /> Library
                </span>
                <button onClick={load} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-secondary">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {files.map(f => {
                    const isActive = currentTrackName === f;
                    return (
                        <div
                            key={f}
                            onClick={() => setCurrentTrack(`${API_BASE}/outputs/${f}`, f)}
                            className={`group p-3 rounded-md cursor-pointer border transition-all ${isActive ? 'bg-primary/20 border-primary/50' : 'bg-secondary/20 hover:bg-secondary/80 border-transparent hover:border-primary/20'}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 transition-colors ${isActive ? 'bg-primary text-white' : 'bg-background text-muted-foreground group-hover:text-primary'}`}>
                                    <FileAudio className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className={`text-xs font-medium truncate mb-0.5 ${isActive ? 'text-primary' : 'text-foreground'}`}>{f}</div>
                                    <div className="text-[10px] text-muted-foreground truncate font-mono">
                                        {f.split('_')[1] || 'Unknown Date'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {files.length === 0 && !loading && (
                    <div className="text-center text-xs text-muted-foreground mt-10">No history found.</div>
                )}
            </div>
        </div>
    );
}
