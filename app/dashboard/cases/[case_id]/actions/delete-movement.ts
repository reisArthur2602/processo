"use server";

import { revalidatePath } from "next/cache";
import { verifyAuth } from "@/lib/auth/verify-auth";
import prisma from "@/lib/prisma";

export const deleteMovement = async (caseId: string, movementId: string) => {
  try {
    await verifyAuth();

    await prisma.movement.delete({
      where: { id: movementId },
    });

    revalidatePath(`/dashboard/cases/${caseId}`);

    return { ok: true, message: "Movimentação excluída com sucesso." };
  } catch {
    return { ok: false, message: "Não foi possível excluir a movimentação." };
  }
};
