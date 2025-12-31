import { create } from 'zustand';

interface StudioState {
    currentTrackUrl: string | null;
    currentTrackName: string | null;
    setCurrentTrack: (url: string | null, name: string | null) => void;
}

export const useStudioStore = create<StudioState>((set) => ({
    currentTrackUrl: null,
    currentTrackName: null,
    setCurrentTrack: (url, name) => set({ currentTrackUrl: url, currentTrackName: name }),
}));
