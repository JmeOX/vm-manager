import { create } from "zustand";

export type RealtimeStatus = "connecting" | "connected" | "disconnected";

export const useRealtimeStore = create<{
  status: RealtimeStatus;
  setStatus: (status: RealtimeStatus) => void;
}>((set) => ({
  status: "connecting",
  setStatus: (status) => set({ status }),
}));
