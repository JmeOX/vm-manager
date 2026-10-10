import { create } from "zustand";

const HIGHLIGHT_MS = 1600;

interface HighlightState {
  ids: Record<string, true>;
  highlight: (id: string) => void;
}

export const useHighlightStore = create<HighlightState>((set) => ({
  ids: {},
  highlight: (id) => {
    set((state) => ({ ids: { ...state.ids, [id]: true } }));
    setTimeout(() => {
      set((state) => {
        const next = { ...state.ids };
        delete next[id];
        return { ids: next };
      });
    }, HIGHLIGHT_MS);
  },
}));

export const useIsHighlighted = (id: string) =>
  useHighlightStore((state) => Boolean(state.ids[id]));
