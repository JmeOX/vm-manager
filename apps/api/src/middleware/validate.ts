import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { HttpError } from "../lib/http-error";

export const validateBody =
  (schema: ZodType): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      }));
      throw new HttpError(400, "VALIDATION_ERROR", "Datos inválidos", details);
    }
    req.body = result.data;
    next();
  };
