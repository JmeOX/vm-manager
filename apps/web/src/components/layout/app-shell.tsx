import { NavLink, Outlet } from "react-router";
import { LayoutDashboard, Server } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { useDevStore } from "@/stores/dev-store";
import { useVmRealtime } from "@/features/vms/use-vm-realtime";
import { UserMenu } from "./user-menu";
import { LiveIndicator } from "./live-indicator";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  {
    to: "/vms",
    label: "Máquinas virtuales",
    shortLabel: "Máquinas",
    icon: Server,
    end: false,
  },
];

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Server className="size-6" aria-hidden="true" />
      </div>
      <span className="font-semibold tracking-tight">VM Manager</span>
    </div>
  );
}

function SimulationBadge() {
  const simulateFailures = useDevStore((s) => s.simulateFailures);
  if (!import.meta.env.DEV || !simulateFailures) return null;
  return (
    <span className="rounded-full border border-dashed border-destructive/50 px-3 py-1 text-xs font-medium text-destructive">
      Simulando fallos
    </span>
  );
}

export function AppShell() {
  useVmRealtime();
  return (
    <div className="flex min-h-svh bg-background text-foreground">
      <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col gap-7 border-r bg-card px-4 py-5 md:flex">
        <div className="px-2">
          <Brand />
        </div>
        <nav aria-label="Principal" className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex min-h-10 items-center gap-2.5 rounded-lg px-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )
              }
            >
              <Icon className="size-6" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b bg-background/80 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <Brand />
            </div>
            <LiveIndicator />
          </div>
          <div className="flex items-center gap-2">
            <SimulationBadge />
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-28 md:px-8 md:pt-8 md:pb-12">
          <Outlet />
        </main>
      </div>

      <nav
        aria-label="Principal"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 border-t bg-card pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {NAV_ITEMS.map(({ to, label, shortLabel, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 text-xs",
                isActive
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground"
              )
            }
          >
            <Icon className="size-[22px]" aria-hidden="true" />
            {shortLabel ?? label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
