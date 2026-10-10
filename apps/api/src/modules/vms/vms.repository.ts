import type { Vm as VmRow } from "@prisma/client";
import type {
  Vm,
  VmCreateInput,
  VmOs,
  VmStatus,
  VmUpdateInput,
} from "@vm/shared";
import { prisma } from "../../lib/prisma";

function toVm(row: VmRow): Vm {
  return {
    ...row,
    os: row.os as VmOs,
    status: row.status as VmStatus,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export const vmsRepository = {
  async findAll(): Promise<Vm[]> {
    const rows = await prisma.vm.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map(toVm);
  },

  async findById(id: string): Promise<Vm | null> {
    const row = await prisma.vm.findUnique({ where: { id } });
    return row ? toVm(row) : null;
  },

  async create(data: VmCreateInput): Promise<Vm> {
    return toVm(await prisma.vm.create({ data }));
  },

  async update(id: string, data: VmUpdateInput): Promise<Vm> {
    return toVm(await prisma.vm.update({ where: { id }, data }));
  },

  async remove(id: string): Promise<void> {
    await prisma.vm.delete({ where: { id } });
  },
};
