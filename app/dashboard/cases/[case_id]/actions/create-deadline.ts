"use server";

import { revalidatePath } from "next/cache";
import { verifyAuth } from "@/lib/auth/verify-auth";
import prisma from "@/lib/prisma";
import {
  type CreateDeadlineInput,
  createDeadlineSchema,
} from "@/schema/create-deadline-schema";

export const createDeadline = async (
  caseId: string,
  input: CreateDeadlineInput,
) => {
  try {
    const user = await verifyAuth();

    const parsed = createDeadlineSchema.safeParse(input);
    if (!parsed.success) return { ok: false, message: "Dados inválidos." };

    await prisma.deadline.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description ?? null,
        dueAt: new Date(parsed.data.dueAt),
        caseId,
        assignedToId: user.id,
      },
    });

    revalidatePath(`/dashboard/cases/${caseId}`);
    return { ok: true, message: "Prazo criado com sucesso." };
  } catch {
    return { ok: false, message: "Não foi possível criar o prazo." };
  }
};
