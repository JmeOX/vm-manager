import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { ThemeProvider } from "@/app/theme-provider";
import { queryClient } from "@/app/query-client";
import { router } from "@/app/router";
import { Toaster } from "@/components/ui/sonner";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster position="bottom-right" mobileOffset={{ bottom: 80 }} />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
