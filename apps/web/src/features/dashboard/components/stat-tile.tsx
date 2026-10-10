interface StatTileProps {
  label: string;
  value: string;
  unit: string;
  pct: number;
  footnote: string;
}

export function StatTile({ label, value, unit, pct, footnote }: StatTileProps) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border bg-card p-6">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <h2>{label}</h2>
        <span className="font-mono text-xs">{pct}%</span>
      </div>
      <p className="flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold tracking-tight tabular-nums">
          {value}
        </span>
        <span className="text-muted-foreground">{unit}</span>
      </p>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${pct}% del total`}
      >
        <div
          className="h-full rounded-full bg-highlight transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">{footnote}</p>
    </section>
  );
}
