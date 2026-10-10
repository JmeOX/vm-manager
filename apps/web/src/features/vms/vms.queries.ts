import { useQuery } from "@tanstack/react-query";
import { vmsApi } from "./vms.api";

export const vmKeys = {
  all: ["vms"] as const,
};

export function useVms() {
  return useQuery({ queryKey: vmKeys.all, queryFn: vmsApi.list });
}
