"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifyAuth } from "@/lib/auth/verify-auth";
import prisma from "@/lib/prisma";

export const deleteCase = async (caseId: string) => {
  try {
    await verifyAuth();
    await prisma.case.delete({ where: { id: caseId } });
    revalidatePath("/dashboard/cases");
  } catch {
    return { ok: false, message: "Não foi possível excluir o processo." };
  }
  redirect("/dashboard/cases");
};
