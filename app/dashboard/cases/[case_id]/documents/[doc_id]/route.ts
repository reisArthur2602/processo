import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session";
import { downloadFromFtp } from "@/lib/ftp";
import prisma from "@/lib/prisma";

export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ case_id: string; doc_id: string }> },
) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { case_id, doc_id } = await params;

  const doc = await prisma.document.findFirst({
    where: { id: doc_id, caseId: case_id },
  });

  if (!doc) {
    return NextResponse.json(
      { error: "Documento não encontrado." },
      { status: 404 },
    );
  }

  try {
    const buffer = await downloadFromFtp(doc.path);
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": doc.mimeType,
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(doc.originalName)}`,
        "Content-Length": String(buffer.length),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível baixar o documento." },
      { status: 500 },
    );
  }
};
