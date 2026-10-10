import type { Vm } from "./vm.schemas";
export interface ServerToClientEvents {
  "vm:created": (vm: Vm) => void;
  "vm:updated": (vm: Vm) => void;
  "vm:deleted": (payload: { id: string }) => void;
}

export interface ClientToServerEvents {}
