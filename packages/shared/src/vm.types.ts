import { z } from "zod";
import { VM_OS, VM_STATUS, vmCreateSchema, vmUpdateSchema } from "./vm.schemas";

export type VmCreateInput = z.infer<typeof vmCreateSchema>;
export type VmUpdateInput = z.infer<typeof vmUpdateSchema>;
export type VmOs = (typeof VM_OS)[number];
export type VmStatus = (typeof VM_STATUS)[number];
