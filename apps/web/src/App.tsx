import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export default function App() {
  const [apiStatus, setApiStatus] = useState("consultando...");

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data: { status: string }) => setApiStatus(data.status))
      .catch(() => setApiStatus("sin conexión"));
  }, []);

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <span className="font-semibold">VM Manager</span>
        <ThemeToggle />
      </header>
      <main className="grid place-items-center p-6">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Frontend listo</CardTitle>
            <CardDescription>
              Vite + React + Tailwind + shadcn/ui
            </CardDescription>
          </CardHeader>
          <CardContent>
            Estado de la API: <strong>{apiStatus}</strong>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
