"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifyAuth } from "@/lib/auth/verify-auth";
import prisma from "@/lib/prisma";

export const deleteIntake = async (clientId: string, intakeId: string) => {
  try {
    await verifyAuth();

    const intake = await prisma.intake.findFirst({
      where: { id: intakeId, clientId },
      select: { id: true },
    });
    if (!intake) {
      return { ok: false, message: "Ficha de atendimento não encontrada." };
    }

    await prisma.intake.delete({ where: { id: intakeId } });
    revalidatePath(`/dashboard/clients/${clientId}`);
  } catch {
    return {
      ok: false,
      message: "Não foi possível excluir a ficha de atendimento.",
    };
  }
  redirect(`/dashboard/clients/${clientId}`);
};
