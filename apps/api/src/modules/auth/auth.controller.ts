import type { Request, Response } from "express";
import * as authService from "./auth.service";
import { env, COOKIE_NAME } from "../../config/env";
import { sessionCookieOptions } from "../../lib/session";

export async function login(req: Request, res: Response) {
  const { user, token } = await authService.login(req.body);
  res.cookie(COOKIE_NAME, token, {
    ...sessionCookieOptions,
    maxAge: env.JWT_EXPIRES_IN_HOURS * 60 * 60 * 1000,
  });
  res.json({ user });
}

export async function me(req: Request, res: Response) {
  const user = await authService.getCurrentUser(req.user!.id);
  res.json({ user });
}

export function logout(_req: Request, res: Response) {
  res.clearCookie(COOKIE_NAME, sessionCookieOptions);
  res.status(204).end();
}
