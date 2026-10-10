import { useMemo } from "react";
import { Link } from "react-router";
import { AlertCircle, Plus, SearchX, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Can } from "@/features/auth/can";
import { useSession } from "@/features/auth/use-session";
import { VmCard } from "./components/vm-card";
import { VmCardSkeleton } from "./components/vm-card-skeleton";
import { VmFilters } from "./components/vm-filters";
import { useVmFilters } from "./use-vm-filters";
import { useVms } from "./vms.queries";

function NewVmButton() {
  return (
    <Can role="ADMIN">
      <Button asChild className="h-11 font-semibold">
        <Link to="/vms/new">
          <Plus aria-hidden="true" />
          Nueva VM
        </Link>
      </Button>
    </Can>
  );
}

export function VmListPage() {
  const { data: vms, isPending, isError, refetch } = useVms();
  const { data: user } = useSession();
  const { q, status, setQ, setStatus, clear } = useVmFilters();

  const counts = useMemo(() => {
    const list = vms ?? [];
    const running = list.filter((vm) => vm.status === "RUNNING").length;
    return {
      all: list.length,
      RUNNING: running,
      STOPPED: list.length - running,
    };
  }, [vms]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (vms ?? []).filter(
      (vm) =>
        (status === "all" || vm.status === status) && vm.name.includes(term)
    );
  }, [vms, q, status]);

  const description = vms
    ? `${counts.all} máquinas · ${counts.RUNNING} encendidas`
    : "Cargando máquinas…";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Máquinas virtuales"
        description={description}
        actions={<NewVmButton />}
      />

      {isPending && (
        <div
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          role="status"
          aria-label="Cargando máquinas virtuales"
        >
          {Array.from({ length: 6 }, (_, i) => (
            <VmCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <EmptyState
          icon={AlertCircle}
          title="No se pudieron cargar las máquinas"
          description="Revisa tu conexión e inténtalo de nuevo."
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Reintentar
            </Button>
          }
        />
      )}

      {vms && vms.length === 0 && (
        <EmptyState
          icon={Server}
          title="Aún no hay máquinas virtuales"
          description={
            user?.role === "ADMIN"
              ? "Crea la primera para empezar a ver el uso de recursos."
              : "Cuando un administrador cree máquinas, aparecerán aquí."
          }
          action={<NewVmButton />}
        />
      )}

      {vms && vms.length > 0 && (
        <>
          <VmFilters
            q={q}
            status={status}
            counts={counts}
            onQChange={setQ}
            onStatusChange={setStatus}
          />
          {filtered.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="Sin resultados"
              description="Ninguna máquina coincide con la búsqueda o el filtro."
              action={
                <Button variant="outline" onClick={clear}>
                  Limpiar filtros
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((vm) => (
                <VmCard key={vm.id} vm={vm} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
