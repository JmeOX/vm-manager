import type { RequestHandler } from "express";
import type { ZodError, ZodType } from "zod";
import { HttpError } from "../lib/http-error";

const toDetails = (error: ZodError) =>
  error.issues.map((i) => ({ field: i.path.join("."), message: i.message }));

export const validateBody =
  (schema: ZodType): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      throw new HttpError(
        400,
        "VALIDATION_ERROR",
        "Datos inválidos",
        toDetails(result.error)
      );
    }
    req.body = result.data;
    next();
  };

export const validateParams =
  (schema: ZodType): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      throw new HttpError(
        400,
        "VALIDATION_ERROR",
        "Parámetros inválidos",
        toDetails(result.error)
      );
    }
    next();
  };
