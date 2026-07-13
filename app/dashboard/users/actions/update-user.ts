"use server";

import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/auth/verify-admin";
import prisma from "@/lib/prisma";
import {
  type UpdateUserInput,
  updateUserSchema,
} from "@/schema/update-user-schema";

export const updateUser = async (userId: string, input: UpdateUserInput) => {
  try {
    const currentUser = await verifyAdmin();

    const parsed = updateUserSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, message: "Dados inválidos." };
    }

    if (currentUser.id === userId && !parsed.data.isActive) {
      return {
        ok: false,
        message: "Você não pode desativar a própria conta.",
      };
    }
    if (currentUser.id === userId && !parsed.data.admin) {
      return {
        ok: false,
        message: "Você não pode remover sua própria permissão de admin.",
      };
    }

    await prisma.user.update({
      where: { id: userId },
      data: parsed.data,
    });

    revalidatePath("/dashboard/users");

    return { ok: true, message: "Usuário atualizado com sucesso." };
  } catch {
    return { ok: false, message: "Não foi possível atualizar o usuário." };
  }
};
