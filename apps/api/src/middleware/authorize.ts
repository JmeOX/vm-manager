import type { RequestHandler } from "express";
import type { UserRole } from "@vm/shared";
import { HttpError } from "../lib/http-error";

export const authorize =
  (...allowedRoles: UserRole[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) {
      throw new HttpError(401, "UNAUTHENTICATED", "Debes iniciar sesión");
    }
    if (!allowedRoles.includes(req.user.role)) {
      throw new HttpError(
        403,
        "FORBIDDEN",
        "No tienes permiso para esta acción"
      );
    }
    next();
  };
