"use server";

import { revalidatePath } from "next/cache";
import { verifyAuth } from "@/lib/auth/verify-auth";
import prisma from "@/lib/prisma";

export const updateCaseStatus = async (
  caseId: string,
  status: "ACTIVE" | "SUSPENDED" | "ARCHIVED",
) => {
  try {
    await verifyAuth();

    await prisma.case.update({
      where: { id: caseId },
      data: { status },
    });

    revalidatePath(`/dashboard/cases/${caseId}`);
    revalidatePath("/dashboard/cases");

    return { ok: true, message: "Status atualizado com sucesso." };
  } catch {
    return { ok: false, message: "Não foi possível atualizar o status." };
  }
};
