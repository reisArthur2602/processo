"use server";

import { revalidatePath } from "next/cache";
import { verifyAuth } from "@/lib/auth/verify-auth";
import prisma from "@/lib/prisma";

export const deleteClient = async (clientId: string) => {
  try {
    await verifyAuth();

    const caseCount = await prisma.case.count({ where: { clientId } });
    if (caseCount > 0) {
      return {
        ok: false,
        message:
          "Este cliente possui processos vinculados e não pode ser excluído.",
      };
    }

    await prisma.client.delete({ where: { id: clientId } });
    revalidatePath("/dashboard/clients");

    return { ok: true, message: "Cliente excluído com sucesso." };
  } catch {
    return { ok: false, message: "Não foi possível excluir o cliente." };
  }
};
