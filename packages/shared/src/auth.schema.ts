import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: "Email inválido" }),
  password: z.string().min(1, { message: "La contraseña es obligatoria" }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const USER_ROLES = ["ADMIN", "CLIENT"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
