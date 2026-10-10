import { cn } from "@/lib/utils";
import { useRealtimeStore, type RealtimeStatus } from "@/stores/realtime-store";

const STATUS: Record<RealtimeStatus, { label: string; dot: string }> = {
  connected: { label: "En vivo", dot: "bg-success" },
  connecting: { label: "Conectando…", dot: "bg-amber-500" },
  disconnected: { label: "Sin conexión", dot: "bg-muted-foreground" },
};

export function LiveIndicator() {
  const status = useRealtimeStore((state) => state.status);
  const { label, dot } = STATUS[status];

  return (
    <div
      role="status"
      className="flex items-center gap-2 text-sm text-muted-foreground"
    >
      <span className="relative flex size-2">
        {status === "connected" && (
          <span className="absolute inline-flex size-full rounded-full bg-success opacity-60 motion-safe:animate-ping" />
        )}
        <span className={cn("relative inline-flex size-2 rounded-full", dot)} />
      </span>
      <span className="hidden sm:inline">{label}</span>
    </div>
  );
}
