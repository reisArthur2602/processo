"use server";

import { revalidatePath } from "next/cache";
import { verifyAuth } from "@/lib/auth/verify-auth";
import { uploadToFtp } from "@/lib/ftp";
import prisma from "@/lib/prisma";

const MAX_SIZE = 50 * 1024 * 1024;

export const uploadDocument = async (caseId: string, formData: FormData) => {
  try {
    const user = await verifyAuth();

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, message: "Nenhum arquivo selecionado." };
    }
    if (file.size > MAX_SIZE) {
      return { ok: false, message: "O arquivo não pode ultrapassar 50 MB." };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const remotePath = await uploadToFtp(buffer, caseId, file.name);

    await prisma.document.create({
      data: {
        name: file.name,
        originalName: file.name,
        path: remotePath,
        mimeType: file.type || "application/octet-stream",
        size: file.size,
        caseId,
        uploadedById: user.id,
      },
    });

    revalidatePath(`/dashboard/cases/${caseId}`);
    return { ok: true, message: "Documento anexado com sucesso." };
  } catch {
    return { ok: false, message: "Não foi possível anexar o documento." };
  }
};
