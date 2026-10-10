import express from "express";
import cookieParser from "cookie-parser";
import { VM_STATUS } from "@vm/shared";
import { authRouter } from "./modules/auth/auth.routes";
import { vmsRouter } from "./modules/vms/vms.routes";
import { errorHandler } from "./middleware/error-handler";

export function createApp() {
  const app = express();
  app.use(cookieParser());
  app.use(express.json());
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", vmStatuses: VM_STATUS });
  });
  app.use("/api/auth", authRouter);
  app.use("/api/vms", vmsRouter); // ← nuevo
  app.use(errorHandler);
  return app;
}
