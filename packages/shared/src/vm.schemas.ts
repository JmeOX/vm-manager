import { z } from "zod";

export const VM_NAME_REGEX = /^[a-z][a-z0-9-]{1,30}[a-z0-9]$/;

export const VM_OS = [
  "UBUNTU_24_04",
  "DEBIAN_12",
  "ROCKY_9",
  "WINDOWS_SERVER_2022",
] as const;
export const VM_STATUS = ["RUNNING", "STOPPED"] as const;

export const vmCreateSchema = z.object({
  name: z.string().trim().regex(VM_NAME_REGEX, {
    message:
      "3–32 caracteres: minúsculas, números y guiones; empieza con letra",
  }),
  cores: z
    .number()
    .int({ message: "Debe ser entero" })
    .min(1, { message: "Mínimo 1 core" })
    .max(64, { message: "Máximo 64 cores" }),
  ramGb: z
    .number()
    .int({ message: "Debe ser entero" })
    .min(1, { message: "Mínimo 1 GB" })
    .max(512, { message: "Máximo 512 GB" }),
  diskGb: z
    .number()
    .int({ message: "Debe ser entero" })
    .min(10, { message: "Mínimo 10 GB" })
    .max(4096, { message: "Máximo 4096 GB" }),
  os: z.enum(VM_OS),
  status: z.enum(VM_STATUS),
});

export const vmUpdateSchema = vmCreateSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Envía al menos un campo para actualizar",
  });

export type VmCreateInput = z.infer<typeof vmCreateSchema>;
export type VmUpdateInput = z.infer<typeof vmUpdateSchema>;
export type VmOs = (typeof VM_OS)[number];
export type VmStatus = (typeof VM_STATUS)[number];

export interface Vm extends VmCreateInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}
