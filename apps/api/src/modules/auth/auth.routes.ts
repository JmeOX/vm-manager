import { Router } from "express";
import { loginSchema } from "@vm/shared";
import { validateBody } from "../../middleware/validate";
import * as authController from "./auth.controller";

export const authRouter = Router();

authRouter.post("/login", validateBody(loginSchema), authController.login);
