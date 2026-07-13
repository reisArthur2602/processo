"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/auth/verify-admin";
import prisma from "@/lib/prisma";
import {
  type CreateUserInput,
  createUserSchema,
} from "@/schema/create-user-schema";

export const createUser = async (input: CreateUserInput) => {
  try {
    await verifyAdmin();

    const parsed = createUserSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, message: "Dados inválidos." };
    }

    const { name, username, password, admin } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return { ok: false, message: "Já existe um usuário com este login." };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: { name, username, passwordHash, admin },
    });

    revalidatePath("/dashboard/users");

    return { ok: true, message: "Usuário cadastrado com sucesso." };
  } catch {
    return { ok: false, message: "Não foi possível cadastrar o usuário." };
  }
};
