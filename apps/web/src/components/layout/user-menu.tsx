import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout, useSession } from "@/features/auth/use-session";
import { useDevStore } from "@/stores/dev-store";

const ROLE_LABELS = { ADMIN: "Administrador", CLIENT: "Cliente" } as const;

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export function UserMenu() {
  const { data: user } = useSession();
  const logout = useLogout();
  const simulateFailures = useDevStore((s) => s.simulateFailures);
  const setSimulateFailures = useDevStore((s) => s.setSimulateFailures);

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-11 gap-3 rounded-full pr-1.5 pl-3"
          aria-label={`Menú de ${user.name}`}
        >
          <span className="hidden flex-col items-end leading-tight sm:flex">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">
              {ROLE_LABELS[user.role]}
            </span>
          </span>
          <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {initials(user.name)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="flex flex-col">
          <span>{user.name}</span>
          <span className="text-xs font-normal text-muted-foreground">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {import.meta.env.DEV && user.role === "ADMIN" && (
          <>
            <DropdownMenuCheckboxItem
              checked={simulateFailures}
              onCheckedChange={(checked) =>
                setSimulateFailures(checked === true)
              }
            >
              Simular fallos (dev)
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onSelect={() => logout.mutate()}>
          <LogOut aria-hidden="true" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
