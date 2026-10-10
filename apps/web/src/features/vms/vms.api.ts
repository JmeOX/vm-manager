import type { Vm, VmCreateInput, VmUpdateInput } from "@vm/shared";
import { http } from "../../lib/http";

export const vmsApi = {
  list: () => http<Vm[]>("/vms"),
  create: (input: VmCreateInput) =>
    http<Vm>("/vms", { method: "POST", body: JSON.stringify(input) }),
  update: (id: string, input: VmUpdateInput) =>
    http<Vm>(`/vms/${id}`, { method: "PUT", body: JSON.stringify(input) }),
  remove: (id: string) => http<void>(`/vms/${id}`, { method: "DELETE" }),
};
