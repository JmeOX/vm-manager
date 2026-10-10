import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { StatusFilter } from "../use-vm-filters";

interface VmFiltersProps {
  q: string;
  status: StatusFilter;
  counts: Record<StatusFilter, number>;
  onQChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
}

const OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "RUNNING", label: "Encendidas" },
  { value: "STOPPED", label: "Apagadas" },
];

export function VmFilters({
  q,
  status,
  counts,
  onQChange,
  onStatusChange,
}: VmFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative sm:w-64">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={q}
          onChange={(e) => onQChange(e.target.value)}
          placeholder="Buscar por nombre"
          aria-label="Buscar por nombre"
          className="h-11 pl-9"
        />
      </div>
      <div
        role="group"
        aria-label="Filtrar por estado"
        className="flex gap-1 self-start rounded-lg bg-muted p-1"
      >
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={status === option.value}
            onClick={() => onStatusChange(option.value)}
            className={cn(
              "min-h-9 rounded-md px-3 text-sm whitespace-nowrap transition-colors",
              status === option.value
                ? "bg-background font-medium text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {option.label} · {counts[option.value]}
          </button>
        ))}
      </div>
    </div>
  );
}
