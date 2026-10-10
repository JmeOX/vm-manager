import { useState } from "react";
import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Vm } from "@vm/shared";
import { cn } from "@/lib/utils";
import { formatNumber } from "../use-resource-totals";

const METRICS = {
  cores: { label: "Cores", unit: "vCPU", subtitle: "Cores asignados" },
  ramGb: { label: "RAM", unit: "GB", subtitle: "RAM asignada, en GB" },
  diskGb: { label: "Disco", unit: "GB", subtitle: "Disco asignado, en GB" },
} as const;
type Metric = keyof typeof METRICS;

interface ChartRow {
  name: string;
  value: number;
}

function ChartTooltip({
  active,
  payload,
  unit,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: ChartRow }>;
  unit: string;
}) {
  const row = payload?.[0]?.payload;
  if (!active || !row) return null;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md">
      <p className="font-mono font-medium">{row.name}</p>
      <p className="text-muted-foreground tabular-nums">
        {formatNumber(row.value)} {unit}
      </p>
    </div>
  );
}

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function ResourceChart({ running }: { running: Vm[] }) {
  const [metric, setMetric] = useState<Metric>("ramGb");
  const { unit, subtitle } = METRICS[metric];

  const data: ChartRow[] = running
    .map((vm) => ({ name: vm.name, value: vm[metric] }))
    .sort((a, b) => b.value - a.value);

  return (
    <section className="flex min-w-0 flex-col gap-5 rounded-xl border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">Recursos por VM encendida</h2>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div
          role="group"
          aria-label="Métrica del gráfico"
          className="flex gap-1 rounded-lg bg-muted p-1"
        >
          {(Object.keys(METRICS) as Metric[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={metric === key}
              onClick={() => setMetric(key)}
              className={cn(
                "min-h-9 rounded-md px-3 text-sm transition-colors",
                metric === key
                  ? "bg-background font-medium shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {METRICS[key].label}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No hay máquinas encendidas.
        </p>
      ) : (
        <div
          role="img"
          aria-label={`Gráfico de barras: ${subtitle.toLowerCase()} por cada VM encendida`}
          style={{ height: data.length * 44 + 8 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 48, bottom: 0, left: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={112}
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "var(--foreground)",
                  fontSize: 13,
                  fontFamily: "var(--font-mono)",
                }}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)", opacity: 0.6 }}
                content={<ChartTooltip unit={unit} />}
              />
              <Bar
                dataKey="value"
                fill="var(--highlight)"
                barSize={12}
                radius={[0, 4, 4, 0]}
                background={{ fill: "var(--muted)", radius: 4 }}
                isAnimationActive={!prefersReducedMotion()}
              >
                <LabelList
                  dataKey="value"
                  position="right"
                  formatter={(value) => formatNumber(Number(value))}
                  style={{ fill: "var(--foreground)", fontSize: 13 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
