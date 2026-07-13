"use server";

import { revalidatePath } from "next/cache";
import { verifyAuth } from "@/lib/auth/verify-auth";
import prisma from "@/lib/prisma";
import {
  type UpdateIntakeInput,
  updateIntakeSchema,
} from "@/schema/update-intake-schema";

const parseDecimal = (value?: string) =>
  value ? value.trim().replace(",", ".") : null;

const TERMINAL_STATUSES = ["CONVERTED", "CANCELED"];

export const updateIntake = async (
  clientId: string,
  intakeId: string,
  input: UpdateIntakeInput,
) => {
  try {
    await verifyAuth();

    const parsed = updateIntakeSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, message: "Dados inválidos." };
    }

    const intake = await prisma.intake.findFirst({
      where: { id: intakeId, clientId },
      select: { status: true, finalizedAt: true },
    });
    if (!intake) {
      return { ok: false, message: "Ficha de atendimento não encontrada." };
    }

    const {
      clientReport,
      preliminaryAnalysis,
      providences,
      otherProvidence,
      feeAmount,
      amountReceived,
      paymentMethod,
      paymentNotes,
    } = parsed.data;

    // O status é controlado pelo sistema: uma ficha convertida ou cancelada
    // permanece nesse estado; caso contrário, é finalizada automaticamente
    // quando o relato e a análise preliminar estiverem preenchidos.
    const status = TERMINAL_STATUSES.includes(intake.status)
      ? intake.status
      : clientReport && preliminaryAnalysis
        ? "FINALIZED"
        : "OPEN";

    await prisma.intake.update({
      where: { id: intakeId },
      data: {
        status,
        clientReport: clientReport || null,
        preliminaryAnalysis: preliminaryAnalysis || null,
        providences,
        otherProvidence: otherProvidence || null,
        feeAmount: parseDecimal(feeAmount),
        amountReceived: parseDecimal(amountReceived),
        paymentMethod: paymentMethod || null,
        paymentNotes: paymentNotes || null,
        finalizedAt:
          status === "FINALIZED" ? (intake.finalizedAt ?? new Date()) : null,
      },
    });

    revalidatePath(`/dashboard/clients/${clientId}`);
    revalidatePath(`/dashboard/clients/${clientId}/intakes/${intakeId}`);

    return { ok: true, message: "Ficha de atendimento atualizada." };
  } catch {
    return {
      ok: false,
      message: "Não foi possível atualizar a ficha de atendimento.",
    };
  }
};
