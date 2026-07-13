"use server";

import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/auth/verify-admin";
import prisma from "@/lib/prisma";

export const deleteUser = async (userId: string) => {
  try {
    const currentUser = await verifyAdmin();

    if (currentUser.id === userId) {
      return { ok: false, message: "Você não pode excluir a própria conta." };
    }

    await prisma.user.delete({ where: { id: userId } });
    revalidatePath("/dashboard/users");

    return { ok: true, message: "Usuário excluído com sucesso." };
  } catch {
    return {
      ok: false,
      message:
        "Não foi possível excluir o usuário. Verifique se ele possui processos ou clientes vinculados.",
    };
  }
};
