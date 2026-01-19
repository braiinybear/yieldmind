import { create } from 'zustand';

interface LoadingState {
    isAppLoaded: boolean;
    setAppLoaded: (loaded: boolean) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
    isAppLoaded: false,
    setAppLoaded: (loaded) => set({ isAppLoaded: loaded }),
}));
