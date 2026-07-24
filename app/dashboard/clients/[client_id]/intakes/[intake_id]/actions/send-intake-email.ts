"use server";

import { sendIntakeEmail } from "@/lib/email";
import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth/verify-auth";

export const sendIntakeEmailAction = async (
  clientId: string,
  intakeId: string,
) => {
  try {
    await verifyAuth();

    const intake = await prisma.intake.findFirst({
      where: { id: intakeId, clientId },
      include: {
        client: { select: { name: true, email: true } },
        responsible: { select: { name: true } },
      },
    });

    if (!intake) {
      return { ok: false, message: "Ficha não encontrada." };
    }

    if (!intake.client.email) {
      return {
        ok: false,
        message: "O cliente não possui e-mail cadastrado.",
      };
    }

    await sendIntakeEmail({
      intakeNumber: intake.number,
      clientName: intake.client.name,
      clientEmail: intake.client.email,
      serviceArea: intake.serviceArea,
      attendedAt: intake.attendedAt,
      responsibleName: intake.responsible.name,
      clientReport: intake.clientReport,
    });

    return { ok: true, message: "Ficha enviada por e-mail com sucesso." };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (
      msg.includes("SMTP") ||
      msg.includes("auth") ||
      msg.includes("connect") ||
      msg.includes("ECONNREFUSED")
    ) {
      return {
        ok: false,
        message: "Não foi possível conectar ao servidor de e-mail.",
      };
    }
    return { ok: false, message: "Não foi possível enviar a ficha por e-mail." };
  }
};
