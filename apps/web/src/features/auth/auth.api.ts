import type { LoginInput, PublicUser } from "@vm/shared";
import { http } from "@/lib/http";

export const authApi = {
  login: (input: LoginInput) =>
    http<{ user: PublicUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    }).then((r) => r.user),
  me: () => http<{ user: PublicUser }>("/auth/me").then((r) => r.user),
  logout: () => http<void>("/auth/logout", { method: "POST" }),
};
