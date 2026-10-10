import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { LoginInput, PublicUser, UserRole } from "@vm/shared";
import { prisma } from "../../lib/prisma";
import { env } from "../../config/env";
import { HttpError } from "../../lib/http-error";

const DUMMY_HASH = bcrypt.hashSync("dummy-password", 10);

export async function login({ email, password }: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email } });
  const passwordOk = await bcrypt.compare(
    password,
    user?.passwordHash ?? DUMMY_HASH
  );

  if (!user || !passwordOk) {
    throw new HttpError(401, "INVALID_CREDENTIALS", "Credenciales inválidas");
  }
  const publicUser: PublicUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as UserRole,
  };

  const token = jwt.sign(
    { sub: user.id, role: publicUser.role },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN_HOURS * 60 * 60,
    }
  );

  return { user: publicUser, token };
}
