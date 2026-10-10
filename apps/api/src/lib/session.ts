import jwt from "jsonwebtoken";
import type { CookieOptions } from "express";
import { USER_ROLES, type UserRole } from "@vm/shared";
import { env } from "../config/env";
import { HttpError } from "./http-error";

export interface SessionUser {
  id: string;
  role: UserRole;
}

export const sessionCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  path: "/",
};

export function signSessionToken(user: SessionUser): string {
  return jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: env.JWT_EXPIRES_IN_HOURS * 60 * 60,
  });
}

export function verifySessionToken(token: string): SessionUser {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    if (
      typeof payload === "object" &&
      typeof payload.sub === "string" &&
      USER_ROLES.includes(payload.role)
    ) {
      return { id: payload.sub, role: payload.role };
    }
  } catch {}
  throw new HttpError(401, "INVALID_SESSION", "Sesión inválida o expirada");
}
