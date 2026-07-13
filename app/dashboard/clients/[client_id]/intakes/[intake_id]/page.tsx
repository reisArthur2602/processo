import type { Metadata } from "next";
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { IntakeDetailData } from "./feature/intake-detail-data";
import { IntakeDetailSkeleton } from "./feature/intake-detail-skeleton";

interface Props {
  params: Promise<{ client_id: string; intake_id: string }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { intake_id } = await params;
  const intake = await prisma.intake.findUnique({
    where: { id: intake_id },
    select: { number: true },
  });

  if (!intake) return { title: "Ficha não encontrada" };

  return { title: `Ficha ${intake.number}` };
};

const IntakeDetailPage = async ({ params }: Props) => {
  const { client_id, intake_id } = await params;

  return (
    <Suspense fallback={<IntakeDetailSkeleton />}>
      <IntakeDetailData clientId={client_id} intakeId={intake_id} />
    </Suspense>
  );
};

export default IntakeDetailPage;
