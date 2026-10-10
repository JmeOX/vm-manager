import { createBrowserRouter, Navigate } from "react-router";
import { ProtectedRoute, PublicOnlyRoute } from "@/features/auth/route-guards";
import { DashboardPage } from "@/features/dashboard/dashboard-page";
import { LoginPage } from "@/features/auth/login-page";

export const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [{ path: "/login", element: <LoginPage /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [{ path: "/", element: <DashboardPage /> }],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
