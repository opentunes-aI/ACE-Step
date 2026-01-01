import { create } from 'zustand';

export type MusicFormat = "wav" | "mp3" | "flac" | "ogg";

interface StudioState {
    // Playback State
    currentTrackUrl: string | null;
    currentTrackName: string | null;
    setCurrentTrack: (url: string | null, name: string | null) => void;

    // Form State
    prompt: string;
    lyrics: string;
    duration: number;
    format: MusicFormat;
    seed: number | null;
    steps: number;
    cfgScale: number;
    retakeVariance: number;
    repaintStart: number | null;
    repaintEnd: number | null;
    activeJobId: string | null;
    isConsoleOpen: boolean;

    // Actions
    setPrompt: (v: string) => void;
    setLyrics: (v: string) => void;
    setDuration: (v: number) => void;
    setFormat: (v: MusicFormat) => void;
    setSeed: (v: number | null) => void;
    setSteps: (v: number) => void;
    setCfgScale: (v: number) => void;
    setRetakeVariance: (v: number) => void;
    setRepaintRegion: (start: number | null, end: number | null) => void;
    setActiveJobId: (id: string | null) => void;
    setConsoleOpen: (v: boolean) => void;

    setAllParams: (params: Partial<Omit<StudioState, 'setCurrentTrack' | 'setAllParams' | 'currentTrackUrl' | 'currentTrackName'>>) => void;
}

export const useStudioStore = create<StudioState>((set) => ({
    // Defaults
    currentTrackUrl: null,
    currentTrackName: null,
    prompt: "upbeat techno with synth leads",
    lyrics: "",
    duration: 60,
    format: "wav",
    seed: null,
    steps: 60,
    cfgScale: 15.0,
    retakeVariance: 0.2,
    repaintStart: null,
    repaintEnd: null,
    activeJobId: null,
    isConsoleOpen: false,

    setCurrentTrack: (url, name) => set({
        currentTrackUrl: url,
        currentTrackName: name,
        repaintStart: null,
        repaintEnd: null
    }),

    setPrompt: (v) => set({ prompt: v }),
    setLyrics: (v) => set({ lyrics: v }),
    setDuration: (v) => set({ duration: v }),
    setFormat: (v) => set({ format: v }),
    setSeed: (v) => set({ seed: v }),
    setSteps: (v) => set({ steps: v }),
    setCfgScale: (v) => set({ cfgScale: v }),
    setRetakeVariance: (v) => set({ retakeVariance: v }),
    setRepaintRegion: (s, e) => set({ repaintStart: s, repaintEnd: e }),
    setActiveJobId: (id) => set({ activeJobId: id, isConsoleOpen: true }),
    setConsoleOpen: (v) => set({ isConsoleOpen: v }),

    setAllParams: (params) => set((state) => ({ ...state, ...params })),
}));
