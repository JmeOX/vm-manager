import express from "express";
import { VM_STATUS } from "@vm/shared";
import { authRouter } from "./modules/auth/auth.routes";
import { errorHandler } from "./middleware/error-handler";
import cookieParser from "cookie-parser";

export function createApp() {
  const app = express();
  app.use(cookieParser());
  app.use(express.json());
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", vmStatuses: VM_STATUS });
  });
  app.use("/api/auth", authRouter);
  app.use(errorHandler);
  return app;
}
