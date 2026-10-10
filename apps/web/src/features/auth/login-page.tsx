import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router";
import { AlertCircle, LoaderCircle, Server } from "lucide-react";
import { loginSchema } from "@vm/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { ApiError } from "@/lib/http";
import { useLogin } from "./use-session";

const DEMO_ACCOUNTS = [
  { label: "Administrador", email: "admin@ifx.test", password: "Admin123!" },
  { label: "Cliente", email: "cliente@ifx.test", password: "Cliente123!" },
];

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const login = useLogin();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit((values) => {
    login.mutate(values, {
      onSuccess: () => navigate(from, { replace: true }),
    });
  });

  const errorMessage =
    login.error instanceof ApiError ? login.error.message : null;

  const fillDemo = (email: string, password: string) => {
    form.setValue("email", email, { shouldValidate: true });
    form.setValue("password", password, { shouldValidate: true });
  };

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-4 py-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex items-center gap-2.5">
        <div className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Server className="size-5" aria-hidden="true" />
        </div>
        <span className="text-lg font-semibold tracking-tight">VM Manager</span>
      </div>

      <main className="flex w-full max-w-sm flex-col gap-6 rounded-2xl border bg-card p-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Inicia sesión
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Gestiona tus máquinas virtuales.
          </p>
        </div>

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              className="h-11"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...form.register("email")}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              className="h-11"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...form.register("password")}
            />
            {errors.password && (
              <p id="password-error" className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
            >
              <AlertCircle
                className="mt-0.5 size-4 shrink-0"
                aria-hidden="true"
              />
              {errorMessage}
            </div>
          )}

          <Button
            type="submit"
            className="mt-1 h-11 font-semibold"
            disabled={login.isPending}
          >
            {login.isPending && (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            )}
            {login.isPending ? "Entrando…" : "Entrar"}
          </Button>
        </form>

        {import.meta.env.DEV && (
          <div className="flex flex-col gap-2 rounded-lg bg-muted p-3.5 text-sm">
            <span className="font-medium">Cuentas de demostración</span>
            {DEMO_ACCOUNTS.map((account) => (
              <div
                key={account.email}
                className="flex items-center justify-between gap-3"
              >
                <span className="text-muted-foreground">{account.label}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemo(account.email, account.password)}
                >
                  Usar {account.email}
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
