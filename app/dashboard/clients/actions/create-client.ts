"use server";

import { revalidatePath } from "next/cache";
import { verifyAuth } from "@/lib/auth/verify-auth";
import prisma from "@/lib/prisma";
import {
  type CreateClientInput,
  createClientSchema,
} from "@/schema/create-client-schema";

export const createClient = async (input: CreateClientInput) => {
  try {
    const user = await verifyAuth();

    const parsed = createClientSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, message: "Dados inválidos." };
    }

    const { document, birthDate, ...rest } = parsed.data;

    if (document) {
      const existing = await prisma.client.findUnique({ where: { document } });
      if (existing) {
        return {
          ok: false,
          message: "Já existe um cliente com este documento.",
        };
      }
    }

    const client = await prisma.client.create({
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
        createdById: user.id,
        responsibleId: user.id,
      },
    });

    revalidatePath("/dashboard/clients");

    return {
      ok: true,
      message: "Cliente cadastrado com sucesso.",
      data: { id: client.id },
    };
  } catch {
    return { ok: false, message: "Não foi possível cadastrar o cliente." };
  }
};
