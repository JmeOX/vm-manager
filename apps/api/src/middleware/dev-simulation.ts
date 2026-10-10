import type { RequestHandler } from "express";
import { env } from "../config/env";
import { HttpError } from "../lib/http-error";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MUTATION_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

export const devSimulation: RequestHandler = async (req, _res, next) => {
  if (env.NODE_ENV !== "development") {
    return next();
  }

  if (env.SIMULATED_LATENCY_MS > 0) {
    await sleep(env.SIMULATED_LATENCY_MS);
  }

  if (
    req.header("x-simulate-failure") === "1" &&
    MUTATION_METHODS.includes(req.method)
  ) {
    throw new HttpError(
      503,
      "SIMULATED_FAILURE",
      "Fallo simulado del servidor (modo desarrollo)"
    );
  }

  next();
};
