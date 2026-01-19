import { prisma } from "../../plugins/prisma";
import { randomUUID } from "crypto";
import { tokenStore } from "./token-store";
import { signToken } from "./jwt";

export const requestMagicLink = async (email: string) => {
  // find or create user
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: { email },
    });
  }

  const token = randomUUID();
  tokenStore.set(token, user.id); // ✅ STORE REAL USER ID

  return {
    magicLink: `http://localhost:3000/auth/verify?token=${token}`,
  };
};

export const verifyMagicLink = async (token: string) => {
  const userId = tokenStore.get(token);
  if (!userId) throw new Error("Invalid or expired token");

  tokenStore.delete(token);

  return {
    token: signToken(userId), // ✅ JWT now contains User.id
  };
};
