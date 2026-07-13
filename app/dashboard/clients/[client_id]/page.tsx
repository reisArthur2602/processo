import type { Metadata } from "next";
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { ClientDetailData } from "./feature/client-detail-data";
import { ClientDetailSkeleton } from "./feature/client-detail-skeleton";

interface Props {
  params: Promise<{ client_id: string }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { client_id } = await params;
  const client = await prisma.client.findUnique({
    where: { id: client_id },
    select: { name: true },
  });

  if (!client) return { title: "Cliente não encontrado" };

  return { title: client.name };
};

const ClientDetailPage = async ({ params }: Props) => {
  const { client_id } = await params;

  return (
    <Suspense fallback={<ClientDetailSkeleton />}>
      <ClientDetailData clientId={client_id} />
    </Suspense>
  );
};

export default ClientDetailPage;
