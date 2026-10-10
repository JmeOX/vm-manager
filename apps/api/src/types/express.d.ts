import type { UserRole } from "@vm/shared";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: UserRole };
    }
  }
}

export {};
