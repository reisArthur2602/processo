import { cookies } from "next/headers";
import { cache } from "react";
import { verifyToken } from "@/lib/auth/token";
import prisma from "@/lib/prisma";

export const getSession = cache(async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    const payload = await verifyToken(token);

    if (!payload) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    return user;
  } catch {
    return null;
  }
});
