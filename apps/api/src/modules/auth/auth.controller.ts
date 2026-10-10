import type { Request, Response } from "express";
import * as authService from "./auth.service";
import { env, COOKIE_NAME } from "../../config/env";

export async function login(req: Request, res: Response) {
  const { user, token } = await authService.login(req.body);

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: env.JWT_EXPIRES_IN_HOURS * 60 * 60 * 1000,
    path: "/",
  });

  res.json({ user });
}
