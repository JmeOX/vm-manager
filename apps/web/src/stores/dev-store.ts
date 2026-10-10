import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DevState {
  simulateFailures: boolean;
  setSimulateFailures: (value: boolean) => void;
}
export const useDevStore = create<DevState>()(
  persist(
    (set) => ({
      simulateFailures: false,
      setSimulateFailures: (value) => set({ simulateFailures: value }),
    }),
    { name: "vm-dev" }
  )
);
