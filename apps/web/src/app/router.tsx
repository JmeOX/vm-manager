import { createBrowserRouter, Navigate } from "react-router";
import { AppShell } from "@/components/layout/app-shell";
import { LoginPage } from "@/features/auth/login-page";
import {
  ProtectedRoute,
  PublicOnlyRoute,
  RequireRole,
} from "@/features/auth/route-guards";
import { DashboardPage } from "@/features/dashboard/dashboard-page";
import { VmFormPage } from "@/features/vms/vm-form-page";
import { VmListPage } from "@/features/vms/vm-list-page";

export const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [{ path: "/login", element: <LoginPage /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: "/", element: <DashboardPage /> },
          { path: "/vms", element: <VmListPage /> },
          {
            element: <RequireRole role="ADMIN" />,
            children: [
              { path: "/vms/new", element: <VmFormPage /> },
              { path: "/vms/:id/edit", element: <VmFormPage /> },
            ],
          },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
