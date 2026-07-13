"use server";

import { revalidatePath } from "next/cache";
import { verifyAuth } from "@/lib/auth/verify-auth";
import prisma from "@/lib/prisma";
import {
  type CreateIntakeInput,
  createIntakeSchema,
} from "@/schema/create-intake-schema";

const generateIntakeNumber = (date: Date) => {
  const stamp = date
    .toISOString()
    .replace(/[-:T.]/g, "")
    .slice(0, 14);
  const suffix = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `FA-${stamp}-${suffix}`;
};

export const createIntake = async (
  clientId: string,
  input: CreateIntakeInput,
) => {
  try {
    const user = await verifyAuth();

    const parsed = createIntakeSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, message: "Dados inválidos." };
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true },
    });
    if (!client) {
      return { ok: false, message: "Cliente não encontrado." };
    }

    const attendedAt = new Date();

    await prisma.intake.create({
      data: {
        number: generateIntakeNumber(attendedAt),
        serviceArea: parsed.data.serviceArea,
        attendedAt,
        clientId,
        responsibleId: user.id,
        createdById: user.id,
      },
    });

    revalidatePath(`/dashboard/clients/${clientId}`);

    return { ok: true, message: "Ficha de atendimento cadastrada." };
  } catch {
    return {
      ok: false,
      message: "Não foi possível cadastrar a ficha de atendimento.",
    };
  }
};
