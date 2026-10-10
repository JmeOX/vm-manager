import type { VmStatus } from "@vm/shared";
import { cn } from "@/lib/utils";
import { STATUS_LABELS } from "../vm-labels";

export function StatusBadge({ status }: { status: VmStatus }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors",
        status === "RUNNING"
          ? "bg-success/15 text-success"
          : "bg-muted text-muted-foreground"
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  );
}
