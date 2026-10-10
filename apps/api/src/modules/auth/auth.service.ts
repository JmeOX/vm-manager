import bcrypt from "bcryptjs";
import type { User } from "@prisma/client";
import type { LoginInput, PublicUser, UserRole } from "@vm/shared";
import { prisma } from "../../lib/prisma";
import { HttpError } from "../../lib/http-error";
import { signSessionToken } from "../../lib/session";

const DUMMY_HASH = bcrypt.hashSync("dummy-password", 10);

function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as UserRole,
  };
}

export async function login({ email, password }: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email } });
  const passwordOk = await bcrypt.compare(
    password,
    user?.passwordHash ?? DUMMY_HASH
  );
  if (!user || !passwordOk) {
    throw new HttpError(401, "INVALID_CREDENTIALS", "Credenciales inválidas");
  }
  const publicUser = toPublicUser(user);
  return {
    user: publicUser,
    token: signSessionToken({ id: publicUser.id, role: publicUser.role }),
  };
}

export async function getCurrentUser(userId: string): Promise<PublicUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new HttpError(401, "INVALID_SESSION", "Sesión inválida o expirada");
  }
  return toPublicUser(user);
}
