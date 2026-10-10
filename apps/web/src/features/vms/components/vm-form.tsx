import { useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  VM_OS,
  VM_STATUS,
  vmCreateSchema,
  type Vm,
  type VmCreateInput,
} from "@vm/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVms } from "../vms.queries";
import { useCreateVm, useUpdateVm } from "../vms.mutations";
import { OS_LABELS, STATUS_LABELS } from "../vm-labels";
import { FormField, fieldDescribedBy } from "./form-field";
import { VmCard } from "./vm-card";

const DEFAULTS: VmCreateInput = {
  name: "",
  cores: 2,
  ramGb: 4,
  diskGb: 40,
  os: "UBUNTU_24_04",
  status: "STOPPED",
};

const toFormValues = (vm: Vm): VmCreateInput => ({
  name: vm.name,
  cores: vm.cores,
  ramGb: vm.ramGb,
  diskGb: vm.diskGb,
  os: vm.os,
  status: vm.status,
});

const orZero = (n: number) => (Number.isFinite(n) ? n : 0);

function UnitInput({
  unit,
  ...props
}: React.ComponentProps<typeof Input> & { unit: string }) {
  return (
    <div className="relative">
      <Input
        type="number"
        inputMode="numeric"
        className="h-11 pr-14"
        {...props}
      />
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
        {unit}
      </span>
    </div>
  );
}

export function VmForm({ vm }: { vm?: Vm }) {
  const navigate = useNavigate();
  const { data: vms = [] } = useVms();
  const createVm = useCreateVm();
  const updateVm = useUpdateVm();
  const isEdit = Boolean(vm);

  const schema = useMemo(() => {
    const takenNames = new Set(
      vms.filter((other) => other.id !== vm?.id).map((other) => other.name)
    );
    return vmCreateSchema.refine((data) => !takenNames.has(data.name), {
      path: ["name"],
      message: "Ya existe una VM con ese nombre",
    });
  }, [vms, vm?.id]);

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: vm ? toFormValues(vm) : DEFAULTS,
  });
  const { errors, isValid, isDirty } = form.formState;
  const values = form.watch();

  const onSubmit = form.handleSubmit((input) => {
    if (vm) updateVm.mutate({ vm, input });
    else createVm.mutate(input);
    navigate("/vms");
  });

  const preview: Vm = {
    id: "preview",
    createdAt: "",
    updatedAt: "",
    name: values.name || "nombre-de-la-vm",
    cores: orZero(values.cores),
    ramGb: orZero(values.ramGb),
    diskGb: orZero(values.diskGb),
    os: values.os,
    status: values.status,
  };

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
      <form
        onSubmit={onSubmit}
        noValidate
        className="flex flex-col gap-5 rounded-xl border bg-card p-5 md:p-6 lg:flex-[2]"
      >
        <FormField
          id="name"
          label="Nombre"
          error={errors.name?.message}
          hint="Minúsculas, números y guiones. Ej.: web-03"
          aside={
            <span className="text-xs text-muted-foreground tabular-nums">
              {values.name.length} / 32
            </span>
          }
        >
          <Input
            id="name"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            className="h-11 font-mono"
            aria-invalid={!!errors.name}
            aria-describedby={fieldDescribedBy(
              "name",
              errors.name?.message,
              "hint"
            )}
            {...form.register("name")}
          />
        </FormField>

        <FormField id="os" label="Sistema operativo" error={errors.os?.message}>
          <select
            id="os"
            className="h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            {...form.register("os")}
          >
            {VM_OS.map((os) => (
              <option
                key={os}
                value={os}
                className="bg-popover text-popover-foreground"
              >
                {OS_LABELS[os]}
              </option>
            ))}
          </select>
        </FormField>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            id="cores"
            label="Cores"
            error={errors.cores?.message}
            hint="Entre 1 y 64"
          >
            <UnitInput
              id="cores"
              unit="vCPU"
              aria-invalid={!!errors.cores}
              aria-describedby={fieldDescribedBy(
                "cores",
                errors.cores?.message,
                "hint"
              )}
              {...form.register("cores", { valueAsNumber: true })}
            />
          </FormField>
          <FormField
            id="ramGb"
            label="RAM"
            error={errors.ramGb?.message}
            hint="Entre 1 y 512 GB"
          >
            <UnitInput
              id="ramGb"
              unit="GB"
              aria-invalid={!!errors.ramGb}
              aria-describedby={fieldDescribedBy(
                "ramGb",
                errors.ramGb?.message,
                "hint"
              )}
              {...form.register("ramGb", { valueAsNumber: true })}
            />
          </FormField>
          <FormField
            id="diskGb"
            label="Disco"
            error={errors.diskGb?.message}
            hint="Entre 10 y 4096 GB"
          >
            <UnitInput
              id="diskGb"
              unit="GB"
              aria-invalid={!!errors.diskGb}
              aria-describedby={fieldDescribedBy(
                "diskGb",
                errors.diskGb?.message,
                "hint"
              )}
              {...form.register("diskGb", { valueAsNumber: true })}
            />
          </FormField>
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-medium">
            {isEdit ? "Estado" : "Estado inicial"}
          </legend>
          <div className="inline-flex gap-1 self-start rounded-lg bg-muted p-1">
            {VM_STATUS.map((status) => (
              <label
                key={status}
                className="flex min-h-9 cursor-pointer items-center rounded-md px-4 text-sm text-muted-foreground transition-colors has-checked:bg-background has-checked:font-medium has-checked:text-foreground has-checked:shadow-sm has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
              >
                <input
                  type="radio"
                  value={status}
                  className="sr-only"
                  {...form.register("status")}
                />
                {STATUS_LABELS[status]}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex justify-end gap-2.5 border-t pt-5">
          <Button variant="outline" className="h-11" asChild>
            <Link to="/vms">Cancelar</Link>
          </Button>
          <Button
            type="submit"
            className="h-11 font-semibold"
            disabled={!isValid || (isEdit && !isDirty)}
          >
            {isEdit ? "Guardar cambios" : "Crear VM"}
          </Button>
        </div>
      </form>

      <aside
        aria-label="Vista previa"
        className="hidden flex-col gap-2.5 lg:flex lg:flex-1"
      >
        <span className="text-sm font-medium text-muted-foreground">
          Vista previa en el listado
        </span>
        <VmCard vm={preview} className="border-dashed" />
      </aside>
    </div>
  );
}
