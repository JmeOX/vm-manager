import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { VM_STATUS } from "@vm/shared";
import { env } from "./config/env";
import { authRouter } from "./modules/auth/auth.routes";
import { vmsRouter } from "./modules/vms/vms.routes";
import { errorHandler } from "./middleware/error-handler";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_ORIGIN,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "10kb" }));
  app.use(cookieParser());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", vmStatuses: VM_STATUS });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/vms", vmsRouter);
  app.use(errorHandler);

  return app;
}
