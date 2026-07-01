import type { Metadata } from "next";
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { CaseDetailData } from "./feature/case-detail-data";
import { CaseDetailSkeleton } from "./feature/case-detail-skeleton";

interface Props {
  params: Promise<{ case_id: string }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { case_id } = await params;
  const caseData = await prisma.case.findUnique({
    where: { id: case_id },
    select: { number: true, title: true },
  });

  if (!caseData) return { title: "Processo não encontrado" };

  return {
    title: caseData.number,
    description: caseData.title ?? undefined,
  };
};

const CaseDetailPage = async ({ params }: Props) => {
  const { case_id } = await params;

  return (
    <Suspense fallback={<CaseDetailSkeleton />}>
      <CaseDetailData caseId={case_id} />
    </Suspense>
  );
};

export default CaseDetailPage;
