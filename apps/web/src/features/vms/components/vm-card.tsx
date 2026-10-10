import type { ReactNode } from "react";
import type { Vm } from "@vm/shared";
import { cn } from "@/lib/utils";
import { useIsHighlighted } from "@/stores/highlight-store";
import { OS_LABELS } from "../vm-labels";
import { StatusBadge } from "./status-badge";

interface VmCardProps {
  vm: Vm;
  footer?: ReactNode;
  className?: string;
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted px-2.5 py-2">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

export function VmCard({ vm, footer, className }: VmCardProps) {
  const highlighted = useIsHighlighted(vm.id); // true durante ~1,6 s tras un evento en vivo

  return (
    <article
      className={cn(
        "relative flex flex-col gap-4 rounded-xl border bg-card p-4 md:p-[18px] motion-safe:transition-shadow motion-safe:duration-500",
        highlighted &&
          "shadow-[0_0_0_2px_var(--highlight),0_0_0_7px_color-mix(in_oklch,var(--highlight)_20%,transparent)]",
        className
      )}
    >
      {highlighted && (
        <span className="absolute -top-2.5 right-4 rounded-full bg-highlight px-2 py-0.5 text-[11px] font-semibold text-background motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95">
          Actualizada en vivo
        </span>
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate font-mono text-[15px] font-semibold">
            {vm.name}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {OS_LABELS[vm.os]}
          </p>
        </div>
        <StatusBadge status={vm.status} />
      </div>
      <dl className="grid grid-cols-3 gap-2 text-sm">
        <Spec label="vCPU" value={String(vm.cores)} />
        <Spec label="RAM" value={`${vm.ramGb} GB`} />
        <Spec label="Disco" value={`${vm.diskGb} GB`} />
      </dl>
      {footer}
    </article>
  );
}
