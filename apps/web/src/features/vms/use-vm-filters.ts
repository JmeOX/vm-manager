import { useSearchParams } from "react-router";
import type { VmStatus } from "@vm/shared";

export type StatusFilter = "all" | VmStatus;

export function useVmFilters() {
  const [params, setParams] = useSearchParams();

  const q = params.get("q") ?? "";
  const rawStatus = params.get("status");
  const status: StatusFilter =
    rawStatus === "RUNNING" || rawStatus === "STOPPED" ? rawStatus : "all";

  const update = (key: string, value: string) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true }
    );

  return {
    q,
    status,
    setQ: (value: string) => update("q", value),
    setStatus: (value: StatusFilter) =>
      update("status", value === "all" ? "" : value),
    clear: () => setParams({}, { replace: true }),
  };
}
