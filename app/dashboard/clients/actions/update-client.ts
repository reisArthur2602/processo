"use server";

import { revalidatePath } from "next/cache";
import { verifyAuth } from "@/lib/auth/verify-auth";
import prisma from "@/lib/prisma";
import {
  type UpdateClientInput,
  updateClientSchema,
} from "@/schema/update-client-schema";

export const updateClient = async (
  clientId: string,
  input: UpdateClientInput,
) => {
  try {
    await verifyAuth();

    const parsed = updateClientSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, message: "Dados inválidos." };
    }

    const { document, birthDate, ...rest } = parsed.data;

    if (document) {
      const existing = await prisma.client.findUnique({ where: { document } });
      if (existing && existing.id !== clientId) {
        return {
          ok: false,
          message: "Já existe um cliente com este documento.",
        };
      }
    }

    await prisma.client.update({
      where: { id: clientId },
      data: {
        ...rest,
        document: document || null,
        rg: rest.rg || null,
        maritalStatus: rest.maritalStatus || null,
        profession: rest.profession || null,
        phone: rest.phone || null,
        email: rest.email || null,
        zipCode: rest.zipCode || null,
        street: rest.street || null,
        number: rest.number || null,
        complement: rest.complement || null,
        district: rest.district || null,
        city: rest.city || null,
        state: rest.state || null,
        notes: rest.notes || null,
        birthDate: birthDate ? new Date(birthDate) : null,
      },
    });

    revalidatePath("/dashboard/clients");
    revalidatePath(`/dashboard/clients/${clientId}`);

    return { ok: true, message: "Cliente atualizado com sucesso." };
  } catch {
    return { ok: false, message: "Não foi possível atualizar o cliente." };
  }
};
