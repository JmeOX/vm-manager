import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Vm, VmCreateInput, VmUpdateInput } from "@vm/shared";
import { ApiError } from "@/lib/http";
import { vmsApi } from "./vms.api";
import { vmKeys } from "./vms.queries";

export const TEMP_ID_PREFIX = "temp-";
export const isOptimisticVm = (vm: Vm) => vm.id.startsWith(TEMP_ID_PREFIX);

const errorText = (error: unknown) =>
  error instanceof ApiError ? error.message : "Ocurrió un error inesperado";

interface Context {
  previous?: Vm[];
  tempId?: string;
}

// ─── Actualizar (incluye encender/apagar) ────────────────────────────────────────
export function useUpdateVm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vm, input }: { vm: Vm; input: VmUpdateInput }) =>
      vmsApi.update(vm.id, input),

    onMutate: async ({ vm, input }): Promise<Context> => {
      await queryClient.cancelQueries({ queryKey: vmKeys.all });
      const previous = queryClient.getQueryData<Vm[]>(vmKeys.all);
      queryClient.setQueryData<Vm[]>(vmKeys.all, (old = []) =>
        old.map((item) => (item.id === vm.id ? { ...item, ...input } : item))
      );
      return { previous };
    },

    onError: (error, { vm }, context) => {
      if (context?.previous)
        queryClient.setQueryData(vmKeys.all, context.previous); // rollback
      toast.error(`No se pudo actualizar ${vm.name}`, {
        description: `${errorText(error)}. Los cambios se revirtieron.`,
      });
    },

    onSuccess: (updated, { input }) => {
      const onlyStatus = Object.keys(input).length === 1 && input.status;
      toast.success(
        onlyStatus
          ? `${updated.name} ${updated.status === "RUNNING" ? "encendida" : "apagada"}`
          : `${updated.name} actualizada`
      );
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: vmKeys.all }),
  });
}

// ─── Eliminar ─────────────────────────────────────────────────────────────────────
export function useDeleteVm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vm: Vm) => vmsApi.remove(vm.id),

    onMutate: async (vm): Promise<Context> => {
      await queryClient.cancelQueries({ queryKey: vmKeys.all });
      const previous = queryClient.getQueryData<Vm[]>(vmKeys.all);
      queryClient.setQueryData<Vm[]>(vmKeys.all, (old = []) =>
        old.filter((item) => item.id !== vm.id)
      );
      return { previous };
    },

    onError: (error, vm, context) => {
      if (context?.previous)
        queryClient.setQueryData(vmKeys.all, context.previous);
      toast.error(`No se pudo eliminar ${vm.name}`, {
        description: `${errorText(error)}. La máquina se restauró.`,
      });
    },

    onSuccess: (_data, vm) => toast.success(`${vm.name} eliminada`),

    onSettled: () => queryClient.invalidateQueries({ queryKey: vmKeys.all }),
  });
}

// ─── Crear ────────────────────────────────
export function useCreateVm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: VmCreateInput) => vmsApi.create(input),

    onMutate: async (input): Promise<Context> => {
      await queryClient.cancelQueries({ queryKey: vmKeys.all });
      const previous = queryClient.getQueryData<Vm[]>(vmKeys.all);
      const tempId = `${TEMP_ID_PREFIX}${crypto.randomUUID()}`;
      const now = new Date().toISOString();

      const optimistic: Vm = {
        ...input,
        id: tempId,
        createdAt: now,
        updatedAt: now,
      };
      queryClient.setQueryData<Vm[]>(vmKeys.all, (old = []) => [
        optimistic,
        ...old,
      ]);
      return { previous, tempId };
    },

    onError: (error, input, context) => {
      if (context?.previous)
        queryClient.setQueryData(vmKeys.all, context.previous);
      toast.error(`No se pudo crear ${input.name}`, {
        description: errorText(error),
      });
    },

    onSuccess: (created, _input, context) => {
      queryClient.setQueryData<Vm[]>(vmKeys.all, (old = []) => {
        const alreadyThere = old.some((item) => item.id === created.id);
        return alreadyThere
          ? old.filter((item) => item.id !== context?.tempId)
          : old.map((item) => (item.id === context?.tempId ? created : item));
      });
      toast.success(`${created.name} creada`);
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: vmKeys.all }),
  });
}
