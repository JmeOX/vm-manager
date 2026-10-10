import type { ReactNode } from "react";
import type { UserRole } from "@vm/shared";
import { useSession } from "./use-session";

export function Can({
  role,
  children,
}: {
  role: UserRole;
  children: ReactNode;
}) {
  const { data: user } = useSession();
  if (user?.role !== role) return null;
  return <>{children}</>;
}
