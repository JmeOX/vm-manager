import express from "express";
import { VM_STATUS } from "@vm/shared";

export function createApp() {
  const app = express();
  app.use(express.json());
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", vmStatuses: VM_STATUS });
  });
  return app;
}
