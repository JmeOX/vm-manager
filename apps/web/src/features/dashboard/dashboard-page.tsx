import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { useVms } from "@/features/vms/vms.queries";
import { FleetStatus } from "./components/fleet-status";
import { ResourceChart } from "./components/resource-chart";
import { RunningVmsTable } from "./components/running-vms-table";
import { StatTile } from "./components/stat-tile";
import {
  formatNumber,
  percent,
  useResourceTotals,
} from "./use-resource-totals";

export function DashboardPage() {
  const { data: vms, isPending, isError, refetch } = useVms();
  const totals = useResourceTotals(vms);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Recursos asignados a las VMs encendidas. Se actualiza en tiempo real."
      />

      {isPending && (
        <div
          className="flex flex-col gap-4"
          role="status"
          aria-label="Cargando dashboard"
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-50 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-[320px] rounded-xl" />
        </div>
      )}

      {isError && (
        <EmptyState
          icon={AlertCircle}
          title="No se pudo cargar el dashboard"
          description="Revisa tu conexión e inténtalo de nuevo."
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Reintentar
            </Button>
          }
        />
      )}

      {vms && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile
              label="VMs encendidas"
              value={String(totals.runningCount)}
              unit={`de ${totals.total}`}
              pct={percent(totals.runningCount, totals.total)}
              footnote={`${totals.total - totals.runningCount} apagadas`}
            />
            <StatTile
              label="Cores"
              value={formatNumber(totals.cores.running)}
              unit="vCPU"
              pct={percent(totals.cores.running, totals.cores.all)}
              footnote={`de ${formatNumber(totals.cores.all)} asignados en total`}
            />
            <StatTile
              label="RAM"
              value={formatNumber(totals.ramGb.running)}
              unit="GB"
              pct={percent(totals.ramGb.running, totals.ramGb.all)}
              footnote={`de ${formatNumber(totals.ramGb.all)} GB asignados en total`}
            />
            <StatTile
              label="Disco"
              value={formatNumber(totals.diskGb.running)}
              unit="GB"
              pct={percent(totals.diskGb.running, totals.diskGb.all)}
              footnote={`de ${formatNumber(totals.diskGb.all)} GB asignados en total`}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="min-w-0 lg:col-span-2">
              <ResourceChart running={totals.running} />
            </div>
            <FleetStatus
              total={totals.total}
              runningCount={totals.runningCount}
              byOs={totals.byOs}
            />
          </div>

          <RunningVmsTable running={totals.running} />
        </>
      )}
    </div>
  );
}
