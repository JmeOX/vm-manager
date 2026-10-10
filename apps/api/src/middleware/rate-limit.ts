import rateLimit from "express-rate-limit";
import { HttpError } from "../lib/http-error";
import { env } from "../config/env";

export const loginRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: () => env.NODE_ENV === "test",
  handler: (_req, _res, next) => {
    next(
      new HttpError(
        429,
        "TOO_MANY_ATTEMPTS",
        "Demasiados intentos fallidos. Intenta de nuevo en un minuto."
      )
    );
  },
});
