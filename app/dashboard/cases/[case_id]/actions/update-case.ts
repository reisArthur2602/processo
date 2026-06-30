"use server";

import { revalidatePath } from "next/cache";
import { verifyAuth } from "@/lib/auth/verify-auth";
import prisma from "@/lib/prisma";
import {
  type UpdateCaseInput,
  updateCaseSchema,
} from "@/schema/update-case-schema";

export const updateCase = async (caseId: string, input: UpdateCaseInput) => {
  try {
    await verifyAuth();

    const parsed = updateCaseSchema.safeParse(input);
    if (!parsed.success) return { ok: false, message: "Dados inválidos." };

    const { actionType, court, division, plaintiffName, defendantName, claimValue } =
      parsed.data;

    const claimValueNum = claimValue
      ? Number(claimValue.replace(",", "."))
      : null;

    await prisma.$transaction([
      prisma.case.update({
        where: { id: caseId },
        data: {
          actionType,
          court,
          division: division || null,
          claimValue: claimValueNum,
          title: `${plaintiffName} x ${defendantName}`,
        },
      }),
      prisma.party.updateMany({
        where: { caseId, partyType: "PLAINTIFF" },
        data: { name: plaintiffName },
      }),
      prisma.party.updateMany({
        where: { caseId, partyType: "DEFENDANT" },
        data: { name: defendantName },
      }),
    ]);

    revalidatePath(`/dashboard/cases/${caseId}`);
    revalidatePath("/dashboard/cases");

    return { ok: true, message: "Processo atualizado com sucesso." };
  } catch {
    return { ok: false, message: "Não foi possível atualizar o processo." };
  }
};
