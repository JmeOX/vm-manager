import { Link } from "react-router";
import type { Vm } from "@vm/shared";
import { OS_LABELS } from "@/features/vms/vm-labels";

export function RunningVmsTable({ running }: { running: Vm[] }) {
  return (
    <section className="overflow-hidden rounded-xl border bg-card">
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <h2 className="font-semibold">Máquinas encendidas</h2>
        <Link
          to="/vms?status=RUNNING"
          className="text-sm font-medium text-highlight hover:underline"
        >
          Ver todas
        </Link>
      </div>
      {running.length === 0 ? (
        <p className="border-t px-5 py-8 text-center text-sm text-muted-foreground">
          No hay máquinas encendidas.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="border-y bg-muted/50 text-left text-muted-foreground">
              <tr>
                <th scope="col" className="px-5 py-2.5 font-medium">
                  Nombre
                </th>
                <th scope="col" className="px-5 py-2.5 font-medium">
                  Sistema operativo
                </th>
                <th scope="col" className="px-5 py-2.5 text-right font-medium">
                  vCPU
                </th>
                <th scope="col" className="px-5 py-2.5 text-right font-medium">
                  RAM
                </th>
                <th scope="col" className="px-5 py-2.5 text-right font-medium">
                  Disco
                </th>
              </tr>
            </thead>
            <tbody>
              {running.map((vm) => (
                <tr key={vm.id} className="border-b last:border-b-0">
                  <td className="px-5 py-3 font-mono">{vm.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {OS_LABELS[vm.os]}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums">
                    {vm.cores}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums">
                    {vm.ramGb} GB
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums">
                    {vm.diskGb} GB
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
