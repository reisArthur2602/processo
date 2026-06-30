"use server";

import { revalidatePath } from "next/cache";
import { verifyAuth } from "@/lib/auth/verify-auth";
import prisma from "@/lib/prisma";
import {
  type AddMovementInput,
  addMovementSchema,
} from "@/schema/add-movement-schema";

export const addMovement = async (caseId: string, input: AddMovementInput) => {
  try {
    const user = await verifyAuth();

    const parsed = addMovementSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, message: "Dados inválidos." };
    }

    await prisma.movement.create({
      data: {
        title: parsed.data.title,
        movementType: parsed.data.movementType,
        description: parsed.data.description,
        occurredAt: new Date(parsed.data.occurredAt),
        caseId,
        createdById: user.id,
      },
    });

    revalidatePath(`/dashboard/cases/${caseId}`);

    return { ok: true, message: "Movimentação adicionada com sucesso." };
  } catch {
    return {
      ok: false,
      message: "Não foi possível adicionar a movimentação.",
    };
  }
};
