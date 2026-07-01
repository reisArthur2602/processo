"use server";

import { revalidatePath } from "next/cache";
import { verifyAuth } from "@/lib/auth/verify-auth";
import { deleteFromFtp } from "@/lib/ftp";
import prisma from "@/lib/prisma";

export const deleteDocument = async (caseId: string, documentId: string) => {
  try {
    await verifyAuth();

    const document = await prisma.document.findFirst({
      where: { id: documentId, caseId },
    });

    if (!document) {
      return { ok: false, message: "Documento não encontrado." };
    }

    await deleteFromFtp(document.path);
    await prisma.document.delete({ where: { id: documentId } });

    revalidatePath(`/dashboard/cases/${caseId}`);
    return { ok: true, message: "Documento excluído com sucesso." };
  } catch {
    return { ok: false, message: "Não foi possível excluir o documento." };
  }
};
