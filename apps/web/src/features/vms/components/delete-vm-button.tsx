import { Trash2 } from "lucide-react";
import type { Vm } from "@vm/shared";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteVm } from "../vms.mutations";

export function DeleteVmButton({ vm }: { vm: Vm }) {
  const deleteVm = useDeleteVm();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon-lg"
          aria-label={`Eliminar ${vm.name}`}
          className="text-destructive"
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Eliminar <span className="font-mono">{vm.name}</span>?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. La máquina desaparecerá para todos
            los usuarios conectados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90"
            onClick={() => deleteVm.mutate(vm)}
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
