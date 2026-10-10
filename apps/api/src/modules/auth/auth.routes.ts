import { Router } from "express";
import { loginSchema } from "@vm/shared";
import { validateBody } from "../../middleware/validate";
import { authenticate } from "../../middleware/authenticate";
import * as authController from "./auth.controller";

export const authRouter = Router();

authRouter.post("/login", validateBody(loginSchema), authController.login);
authRouter.get("/me", authenticate, authController.me);
authRouter.post("/logout", authController.logout);
