import { useMemo } from "react";
import { VM_OS, type Vm } from "@vm/shared";

type NumericKey = "cores" | "ramGb" | "diskGb";

const sum = (vms: Vm[], key: NumericKey) =>
  vms.reduce((total, vm) => total + vm[key], 0);

export function useResourceTotals(vms: Vm[] | undefined) {
  return useMemo(() => {
    const all = vms ?? [];
    const running = all.filter((vm) => vm.status === "RUNNING");

    const resource = (key: NumericKey) => ({
      running: sum(running, key),
      all: sum(all, key),
    });

    return {
      total: all.length,
      running,
      runningCount: running.length,
      cores: resource("cores"),
      ramGb: resource("ramGb"),
      diskGb: resource("diskGb"),
      byOs: VM_OS.map((os) => ({
        os,
        count: all.filter((vm) => vm.os === os).length,
      })).filter((item) => item.count > 0),
    };
  }, [vms]);
}

export const percent = (part: number, whole: number) =>
  whole > 0 ? Math.round((part / whole) * 100) : 0;

export const formatNumber = (value: number) =>
  new Intl.NumberFormat("es-CO").format(value);
