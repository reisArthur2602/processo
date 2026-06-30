"use server";

import { revalidatePath } from "next/cache";
import { verifyAuth } from "@/lib/auth/verify-auth";
import prisma from "@/lib/prisma";
import {
  type CreateCaseInput,
  createCaseSchema,
} from "@/schema/create-case-schema";

export const createCase = async (input: CreateCaseInput) => {
  try {
    const user = await verifyAuth();

    const parsed = createCaseSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, message: "Dados inválidos." };
    }

    const { number, actionType, court, plaintiffName, defendantName } =
      parsed.data;

    const existing = await prisma.case.findUnique({ where: { number } });
    if (existing) {
      return {
        ok: false,
        message: "Já existe um processo com este número.",
      };
    }

    const newCase = await prisma.case.create({
      data: {
        number,
        title: `${plaintiffName} x ${defendantName}`,
        actionType,
        court,
        responsibleLawyerId: user.id,
        createdById: user.id,
        parties: {
          create: [
            {
              name: plaintiffName,
              partyType: "PLAINTIFF",
              personType: "INDIVIDUAL",
            },
            {
              name: defendantName,
              partyType: "DEFENDANT",
              personType: "INDIVIDUAL",
            },
          ],
        },
      },
    });

    revalidatePath("/dashboard/cases");

    return {
      ok: true,
      message: "Processo cadastrado com sucesso.",
      data: { id: newCase.id },
    };
  } catch {
    return {
      ok: false,
      message: "Não foi possível cadastrar o processo.",
    };
  }
};
