import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import prisma from "@/lib/prisma";
import {
  CaseInteractive,
  type DocumentRow,
  type MovementRow,
} from "./case-interactive";
import { CaseOptionsMenu } from "./case-options-menu";

const getCaseDetail = cache(async (caseId: string) => {
  return prisma.case.findUnique({
    where: { id: caseId },
    include: {
      parties: true,
      movements: {
        orderBy: { occurredAt: "desc" },
        include: { createdBy: { select: { name: true } } },
      },
      documents: { orderBy: { createdAt: "desc" } },
      deadlines: {
        where: { status: "PENDING" },
        orderBy: { dueAt: "asc" },
        take: 1,
      },
    },
  });
});

const CaseDetailData = async ({ caseId }: { caseId: string }) => {
  const caseData = await getCaseDetail(caseId);

  if (!caseData) notFound();

  const plaintiff =
    caseData.parties.find((p) => p.partyType === "PLAINTIFF") ?? null;
  const defendant =
    caseData.parties.find((p) => p.partyType === "DEFENDANT") ?? null;
  const nextDeadline = caseData.deadlines[0] ?? null;

  const movements: MovementRow[] = caseData.movements.map((m) => ({
    id: m.id,
    title: m.title,
    movementType: m.movementType,
    description: m.description,
    occurredAt: m.occurredAt.toISOString(),
    createdByName: m.createdBy.name,
  }));

  const documents: DocumentRow[] = caseData.documents.map((d) => ({
    id: d.id,
    name: d.name,
    originalName: d.originalName,
    mimeType: d.mimeType,
    size: d.size,
    createdAt: d.createdAt.toISOString(),
  }));

  const claimValue = caseData.claimValue
    ? Number(caseData.claimValue).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    : null;

  const copyText = [
    `Processo ${caseData.number}`,
    plaintiff && defendant ? `${plaintiff.name} x ${defendant.name}` : null,
    caseData.actionType,
    claimValue,
  ]
    .filter(Boolean)
    .join(" — ");

  return (
    <div>
      {/* Page top bar */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <Link
          href="/dashboard/cases"
          className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-slate transition hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para processos
        </Link>
        <CaseOptionsMenu
          caseId={caseData.id}
          status={caseData.status as "ACTIVE" | "SUSPENDED" | "ARCHIVED"}
          caseNumber={caseData.number}
          initialData={{
            actionType: caseData.actionType,
            court: caseData.court,
            division: caseData.division,
            claimValue: caseData.claimValue ? Number(caseData.claimValue) : null,
            plaintiffName: plaintiff?.name ?? null,
            defendantName: defendant?.name ?? null,
          }}
        />
      </div>

      <CaseInteractive
        caseId={caseData.id}
        caseStatus={caseData.status as "ACTIVE" | "SUSPENDED" | "ARCHIVED"}
        caseNumber={caseData.number}
        actionType={caseData.actionType}
        plaintiffParty={
          plaintiff
            ? { name: plaintiff.name, document: plaintiff.document }
            : null
        }
        defendantParty={
          defendant
            ? { name: defendant.name, document: defendant.document }
            : null
        }
        court={caseData.court}
        division={caseData.division}
        claimValue={claimValue}
        nextDeadline={
          nextDeadline
            ? {
                title: nextDeadline.title,
                dueAt: nextDeadline.dueAt.toISOString(),
                description: nextDeadline.description,
              }
            : null
        }
        initialMovements={movements}
        documents={documents}
        copyText={copyText}
      />
    </div>
  );
};

export { CaseDetailData };
