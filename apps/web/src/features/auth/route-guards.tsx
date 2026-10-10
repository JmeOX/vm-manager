import { Navigate, Outlet, useLocation } from "react-router";
import { FullScreenLoader } from "@/components/full-screen-loader";
import { useSession } from "./use-session";

export function ProtectedRoute() {
  const { data: user, isPending } = useSession();
  const location = useLocation();

  if (isPending) return <FullScreenLoader />;
  if (!user)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { data: user, isPending } = useSession();

  if (isPending) return <FullScreenLoader />;
  if (user) return <Navigate to="/" replace />;
  return <Outlet />;
}
