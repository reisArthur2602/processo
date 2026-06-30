"use server";

import { cookies } from "next/headers";
import { comparePassword, generateToken } from "@/lib/auth/token";
import prisma from "@/lib/prisma";
import { type LoginInput, loginSchema } from "@/schema/login-schema";

export const login = async (input: LoginInput) => {
  try {
    const parsed = loginSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        message: "Dados inválidos.",
      };
    }

    const user = await prisma.user.findUnique({
      where: { username: parsed.data.username },
    });

    if (!user) {
      return {
        ok: false,
        message: "Usuário ou senha inválidos.",
      };
    }

    const isPasswordValid = await comparePassword(
      parsed.data.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      return {
        ok: false,
        message: "Usuário ou senha inválidos.",
      };
    }

    if (!user.isActive) {
      return {
        ok: false,
        message: "Sua conta foi desativada.",
      };
    }

    const token = await generateToken(user.id);

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: parsed.data.rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60,
    });

    return {
      ok: true,
      message: "Login realizado com sucesso.",
    };
  } catch {
    return {
      ok: false,
      message: "Não foi possível realizar o login.",
    };
  }
};
