"use client";
import { useEffect, useRef, useState } from "react";
import { JobStatus, getStatus } from "@/utils/api";
import { Terminal, Minimize2, Maximize2, AlertCircle, CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";
import { syncTrackToCloud } from "@/utils/supabase";

interface ConsoleDrawerProps {
    activeJobId: string | null;
    onClose?: () => void;
}

export default function ConsoleDrawer({ activeJobId }: ConsoleDrawerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [status, setStatus] = useState<JobStatus | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-open on new job
    useEffect(() => {
        if (activeJobId) {
            setIsOpen(true);
            setLogs([`Connecting to job ${activeJobId}...`]);
            setStatus(null);

            // Start polling
            if (intervalRef.current) clearInterval(intervalRef.current);

            intervalRef.current = setInterval(async () => {
                try {
                    const s = await getStatus(activeJobId);
                    setStatus(s);
                    // Append message if different from last logged message
                    setLogs(prev => {
                        const lastMsg = prev[prev.length - 1];
                        // Only add if message changed and is meaningful
                        if (s.message && (!lastMsg || !lastMsg.includes(s.message))) {
                            return [...prev, s.message];
                        }
                        return prev;
                    });



                    if (s.status === "completed") {
                        if (s.result && s.result.length > 0) {
                            setLogs(prev => [...prev, "Syncing metadata to cloud..."]);
                            syncTrackToCloud(s.result[0]).then(() => {
                                setLogs(prev => [...prev, "Cloud Sync: OK"]);
                            });
                        }
                    }

                    if (s.status === "completed" || s.status === "failed") {
                        if (intervalRef.current) clearInterval(intervalRef.current);
                    }
                } catch {
                    setLogs(prev => [...prev, "Polling error..."]);
                }
            }, 1000);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
    }, [activeJobId]);

    // If never used, hide (or keep minimized)
    if (!activeJobId && logs.length === 0) return null;

    return (
        <div className={clsx(
            "fixed bottom-0 left-0 right-0 bg-card border-t border-border transition-all duration-300 ease-in-out shadow-2xl z-50 flex flex-col",
            isOpen ? "h-64" : "h-10"
        )}>
            {/* Header */}
            <div
                className="h-10 bg-secondary/50 flex items-center px-4 justify-between cursor-pointer hover:bg-secondary/80 transition-colors shrink-0"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
                    <Terminal className="w-4 h-4" />
                    <span>Console Output</span>
                    {status && (
                        <div className="flex items-center gap-2 ml-2">
                            <span className={clsx("px-2 py-0.5 rounded text-xs", {
                                "bg-primary/20 text-primary": status.status === "processing",
                                "bg-yellow-500/20 text-yellow-400": status.status === "queued",
                                "bg-red-500/20 text-red-400": status.status === "failed",
                                "bg-green-500/20 text-green-400": status.status === "completed",
                            })}>
                                {status.status.toUpperCase()}
                            </span>
                            {status.status === 'processing' && (
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-300 ease-out"
                                            style={{ width: `${Math.max(0, Math.min(100, (status.progress || 0) * 100))}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-mono">{Math.round((status.progress || 0) * 100)}%</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    {isOpen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 font-mono text-xs flex-1 overflow-y-auto space-y-1 bg-black/95 text-zinc-300">
                {logs.map((log, i) => (
                    <div key={i} className="border-b border-white/5 pb-0.5 mb-0.5 last:border-0 break-words">
                        <span className="text-zinc-600 mr-2 select-none">[{new Date().toLocaleTimeString()}]</span>
                        {log}
                    </div>
                ))}
                {status?.status === 'failed' && (
                    <div className="mt-4 p-3 bg-red-900/20 border border-red-900/50 rounded text-red-400 flex items-start gap-2 animate-in fade-in slide-in-from-bottom-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <div>
                            <div className="font-bold">Execution Failed</div>
                            <div>{status.error || "Unknown backend error"}</div>
                        </div>
                    </div>
                )}
                {status?.status === 'completed' && (
                    <div className="mt-4 p-3 bg-green-900/20 border border-green-900/50 rounded text-green-400 flex items-start gap-2 animate-in fade-in slide-in-from-bottom-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                        <div>
                            <div className="font-bold">Generation Complete</div>
                            <div>Output saved. Check History sidebar.</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
