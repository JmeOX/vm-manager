import { Prisma } from "@prisma/client";
import type { Vm, VmCreateInput, VmUpdateInput } from "@vm/shared";
import { HttpError } from "../../lib/http-error";
import { realtime } from "../../realtime/socket";
import { vmsRepository } from "./vms.repository";

function isUniqueNameError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

const nameTaken = () =>
  new HttpError(409, "VM_NAME_TAKEN", "Ya existe una VM con ese nombre", [
    { field: "name", message: "Ya existe una VM con ese nombre" },
  ]);

async function ensureExists(id: string): Promise<void> {
  if (!(await vmsRepository.findById(id))) {
    throw new HttpError(404, "VM_NOT_FOUND", "La VM no existe");
  }
}

export async function list(): Promise<Vm[]> {
  return vmsRepository.findAll();
}

export async function create(input: VmCreateInput): Promise<Vm> {
  try {
    const vm = await vmsRepository.create(input);
    realtime.vmCreated(vm);
    return vm;
  } catch (error) {
    if (isUniqueNameError(error)) throw nameTaken();
    throw error;
  }
}

export async function update(id: string, input: VmUpdateInput): Promise<Vm> {
  await ensureExists(id);
  try {
    const vm = await vmsRepository.update(id, input);
    realtime.vmUpdated(vm);
    return vm;
  } catch (error) {
    if (isUniqueNameError(error)) throw nameTaken();
    throw error;
  }
}

export async function remove(id: string): Promise<void> {
  await ensureExists(id);
  await vmsRepository.remove(id);
  realtime.vmDeleted(id);
}
