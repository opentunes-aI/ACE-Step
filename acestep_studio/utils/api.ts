const API_BASE = "http://127.0.0.1:8000";

export interface GenerationRequest {
    prompt: string;
    duration: number;
    infer_steps: number;
    seed?: number;
}

export interface JobStatus {
    job_id: string;
    status: "queued" | "processing" | "completed" | "failed";
    progress: number;
    message: string;
    result?: string[];
    error?: string;
}

export async function generateMusic(req: GenerationRequest): Promise<JobStatus> {
    const res = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error("Failed to start generation");
    return res.json();
}

export async function getStatus(jobId: string): Promise<JobStatus> {
    const res = await fetch(`${API_BASE}/status/${jobId}`);
    if (!res.ok) throw new Error("Failed to get status");
    return res.json();
}

export async function getHistory(): Promise<{ files: string[] }> {
    const res = await fetch(`${API_BASE}/history`);
    return res.json();
}
