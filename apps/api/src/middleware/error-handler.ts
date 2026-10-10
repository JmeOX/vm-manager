import type { ErrorRequestHandler } from "express";
import { HttpError } from "../lib/http-error";
import { env } from "../config/env";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      error: { code: err.code, message: err.message, details: err.details },
    });
    return;
  }
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      error: { code: "INVALID_JSON", message: "El body no es JSON válido" },
    });
    return;
  }
  console.error(err);
  const message = env.NODE_ENV === "production" ? "Error interno" : String(err);
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message } });
};
