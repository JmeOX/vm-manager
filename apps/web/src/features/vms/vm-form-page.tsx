import { Link, useParams } from "react-router";
import { ArrowLeft, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { VmForm } from "./components/vm-form";
import { useVms } from "./vms.queries";

export function VmFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { data: vms, isPending } = useVms();
  const vm = vms?.find((item) => item.id === id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Link
          to="/vms"
          className="inline-flex items-center gap-1.5 self-start text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Máquinas virtuales
        </Link>
        <PageHeader
          title={isEdit ? "Editar máquina virtual" : "Nueva máquina virtual"}
          description="Los datos se validan mientras escribes."
        />
      </div>

      {isEdit && isPending ? (
        <Skeleton className="h-160 rounded-xl" />
      ) : isEdit && !vm ? (
        <EmptyState
          icon={SearchX}
          title="Esta máquina ya no existe"
          description="Puede que otro administrador la haya eliminado."
          action={
            <Button variant="outline" asChild>
              <Link to="/vms">Volver al listado</Link>
            </Button>
          }
        />
      ) : (
        <VmForm key={vm?.id ?? "new"} vm={vm} />
      )}
    </div>
  );
}
