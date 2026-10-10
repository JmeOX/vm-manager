import type { RequestHandler } from "express";
import { COOKIE_NAME } from "../config/env";
import { HttpError } from "../lib/http-error";
import { verifySessionToken } from "../lib/session";

export const authenticate: RequestHandler = (req, _res, next) => {
  const token: string | undefined = req.cookies?.[COOKIE_NAME];
  if (!token) {
    throw new HttpError(401, "UNAUTHENTICATED", "Debes iniciar sesión");
  }
  req.user = verifySessionToken(token);
  next();
};
