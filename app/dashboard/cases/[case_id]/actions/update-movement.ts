"use server";

import { revalidatePath } from "next/cache";
import { verifyAuth } from "@/lib/auth/verify-auth";
import prisma from "@/lib/prisma";
import {
  type UpdateMovementInput,
  updateMovementSchema,
} from "@/schema/update-movement-schema";

export const updateMovement = async (
  caseId: string,
  movementId: string,
  input: UpdateMovementInput,
) => {
  try {
    await verifyAuth();

    const parsed = updateMovementSchema.safeParse(input);
    if (!parsed.success) return { ok: false, message: "Dados inválidos." };

    await prisma.movement.update({
      where: { id: movementId },
      data: {
        title: parsed.data.title,
        movementType: parsed.data.movementType,
        description: parsed.data.description,
        occurredAt: new Date(parsed.data.occurredAt),
      },
    });

    revalidatePath(`/dashboard/cases/${caseId}`);

    return { ok: true, message: "Movimentação atualizada com sucesso." };
  } catch {
    return { ok: false, message: "Não foi possível atualizar a movimentação." };
  }
};
