import { LoaderCircle } from "lucide-react";

export function FullScreenLoader() {
  return (
    <div
      className="grid min-h-svh place-items-center bg-background"
      role="status"
    >
      <LoaderCircle
        className="size-6 animate-spin text-muted-foreground"
        aria-hidden="true"
      />
      <span className="sr-only">Cargando…</span>
    </div>
  );
}
