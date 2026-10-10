import type { VmOs } from "@vm/shared";
import { OS_LABELS } from "@/features/vms/vm-labels";

interface FleetStatusProps {
  total: number;
  runningCount: number;
  byOs: { os: VmOs; count: number }[];
}

export function FleetStatus({ total, runningCount, byOs }: FleetStatusProps) {
  const stoppedCount = total - runningCount;

  return (
    <section className="flex flex-col gap-5 rounded-xl border bg-card p-5">
      <div>
        <h2 className="font-semibold">Estado de la flota</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {total} máquinas en total
        </p>
      </div>

      <div
        className="flex h-3 gap-0.5 overflow-hidden rounded-full"
        aria-hidden="true"
      >
        {runningCount > 0 && (
          <div
            className="bg-success transition-[flex-grow] duration-500"
            style={{ flexGrow: runningCount }}
          />
        )}
        {stoppedCount > 0 && (
          <div
            className="bg-muted-foreground/40 transition-[flex-grow] duration-500"
            style={{ flexGrow: stoppedCount }}
          />
        )}
      </div>

      <dl className="flex flex-col gap-2.5 text-sm">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-success" aria-hidden="true" />
          <dt className="flex-1">Encendidas</dt>
          <dd className="font-semibold tabular-nums">{runningCount}</dd>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 rounded-full bg-muted-foreground/40"
            aria-hidden="true"
          />
          <dt className="flex-1">Apagadas</dt>
          <dd className="font-semibold tabular-nums">{stoppedCount}</dd>
        </div>
      </dl>

      <div className="h-px bg-border" />

      <div className="flex flex-col gap-2.5 text-sm">
        <h3 className="text-muted-foreground">Por sistema operativo</h3>
        <dl className="flex flex-col gap-2.5">
          {byOs.map(({ os, count }) => (
            <div key={os} className="flex justify-between gap-3">
              <dt>{OS_LABELS[os]}</dt>
              <dd className="font-semibold tabular-nums">{count}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
