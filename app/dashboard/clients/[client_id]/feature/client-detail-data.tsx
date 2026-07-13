import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getSession } from "@/lib/auth/get-session";
import prisma from "@/lib/prisma";
import {
  type ClientCaseRow,
  type ClientIntakeRow,
  ClientInteractive,
} from "./client-interactive";

const getClientDetail = cache(async (clientId: string) => {
  return prisma.client.findUnique({
    where: { id: clientId },
    include: {
      cases: { orderBy: { updatedAt: "desc" } },
      intakes: {
        orderBy: { attendedAt: "desc" },
        include: { responsible: { select: { name: true } } },
      },
    },
  });
});

const ClientDetailData = async ({ clientId }: { clientId: string }) => {
  const [client, session] = await Promise.all([
    getClientDetail(clientId),
    getSession(),
  ]);

  if (!client) notFound();

  const now = new Date();
  const attendedAtLabel = `${now.toLocaleDateString("pt-BR")} às ${now.toLocaleTimeString(
    "pt-BR",
    { hour: "2-digit", minute: "2-digit" },
  )}`;

  const cases: ClientCaseRow[] = client.cases.map((c) => ({
    id: c.id,
    number: c.number,
    title: c.title,
    serviceArea: c.serviceArea,
    actionType: c.actionType,
    status: c.status,
    updatedAt: c.updatedAt.toISOString(),
  }));

  const intakes: ClientIntakeRow[] = client.intakes.map((i) => ({
    id: i.id,
    number: i.number,
    status: i.status,
    serviceArea: i.serviceArea,
    attendedAt: i.attendedAt.toISOString(),
    finalizedAt: i.finalizedAt ? i.finalizedAt.toISOString() : null,
    responsibleName: i.responsible.name,
  }));

  return (
    <div>
      {/* Page top bar */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <Link
          href="/dashboard/clients"
          className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-slate transition hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para clientes
        </Link>
      </div>

      <ClientInteractive
        client={{
          id: client.id,
          personType: client.personType,
          status: client.status,
          name: client.name,
          document: client.document,
          rg: client.rg,
          birthDate: client.birthDate ? client.birthDate.toISOString() : null,
          maritalStatus: client.maritalStatus,
          profession: client.profession,
          phone: client.phone,
          email: client.email,
          zipCode: client.zipCode,
          street: client.street,
          number: client.number,
          complement: client.complement,
          district: client.district,
          city: client.city,
          state: client.state,
          notes: client.notes,
          casesCount: cases.length,
          updatedAt: client.updatedAt.toISOString(),
        }}
        cases={cases}
        intakes={intakes}
        attendedAtLabel={attendedAtLabel}
        responsibleName={session?.name ?? "—"}
      />
    </div>
  );
};

export { ClientDetailData };
