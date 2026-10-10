import { Link } from "react-router";
import { LoaderCircle, Pencil } from "lucide-react";
import type { Vm } from "@vm/shared";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUpdateVm } from "../vms.mutations";
import { DeleteVmButton } from "./delete-vm-button";

export function VmCardActions({ vm }: { vm: Vm }) {
  const updateVm = useUpdateVm();
  const running = vm.status === "RUNNING";
  const switchId = `power-${vm.id}`;

  return (
    <div className="flex items-center gap-2 border-t pt-3">
      <Switch
        id={switchId}
        checked={running}
        onCheckedChange={(checked) =>
          updateVm.mutate({
            vm,
            input: { status: checked ? "RUNNING" : "STOPPED" },
          })
        }
        aria-label={running ? `Apagar ${vm.name}` : `Encender ${vm.name}`}
      />
      <Label
        htmlFor={switchId}
        className="flex-1 font-normal text-muted-foreground"
      >
        {running ? "Encendida" : "Apagada"}
      </Label>
      <Button variant="outline" size="icon-lg" asChild>
        <Link to={`/vms/${vm.id}/edit`} aria-label={`Editar ${vm.name}`}>
          <Pencil aria-hidden="true" />
        </Link>
      </Button>
      <DeleteVmButton vm={vm} />
    </div>
  );
}

export function SavingFooter() {
  return (
    <div
      className="flex min-h-11 items-center gap-2 border-t pt-3 text-sm text-muted-foreground"
      role="status"
    >
      <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
      Guardando…
    </div>
  );
}
