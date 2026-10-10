import { Button } from "@/components/ui/button";
import { useLogout, useSession } from "@/features/auth/use-session";

export function DashboardPage() {
  const { data: user } = useSession();
  const logout = useLogout();

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold">Hola, {user?.name}</h1>
      <p className="text-muted-foreground">Rol: {user?.role}</p>
      <Button
        variant="outline"
        className="self-start"
        onClick={() => logout.mutate()}
        disabled={logout.isPending}
      >
        Cerrar sesión
      </Button>
    </main>
  );
}
