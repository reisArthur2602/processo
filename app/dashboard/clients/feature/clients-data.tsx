import { cache } from "react";
import prisma from "@/lib/prisma";
import type { ClientRow } from "./clients-columns";
import { ClientsTable } from "./clients-table";
import { NewClientButton } from "./new-client-button";

const getPageData = cache(async () => {
  return Promise.all([
    prisma.client.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        _count: { select: { cases: true } },
      },
    }),
    prisma.client.count(),
    prisma.client.count({ where: { status: "ACTIVE" } }),
    prisma.client.count({ where: { status: "PROSPECT" } }),
  ]);
});

const ClientsData = async () => {
  const [clients, totalCount, activeCount, prospectCount] = await getPageData();

  const tableData: ClientRow[] = clients.map((c) => ({
    id: c.id,
    personType: c.personType as ClientRow["personType"],
    status: c.status as ClientRow["status"],
    name: c.name,
    document: c.document,
    rg: c.rg,
    birthDate: c.birthDate ? c.birthDate.toISOString() : null,
    maritalStatus: c.maritalStatus,
    profession: c.profession,
    phone: c.phone,
    email: c.email,
    zipCode: c.zipCode,
    street: c.street,
    number: c.number,
    complement: c.complement,
    district: c.district,
    city: c.city,
    state: c.state,
    notes: c.notes,
    casesCount: c._count.cases,
    updatedAt: c.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-8">
      {/* Page header */}
      <section className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
        <div>
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-navy">
            <span className="h-px w-8 bg-docket" aria-hidden="true" />
            Carteira jurídica
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
            Clientes
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate">
            Consulte, cadastre e gerencie os clientes do escritório.
          </p>
        </div>
        <NewClientButton />
      </section>

      {/* Stats */}
      <section
        className="grid gap-4 sm:grid-cols-3"
        aria-label="Resumo da carteira de clientes"
      >
        <article className="rounded-card border border-line bg-white p-5 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">
            Total de clientes
          </p>
          <div className="mt-3 flex items-end justify-between">
            <strong className="font-display text-4xl">{totalCount}</strong>
          </div>
        </article>

        <article className="rounded-card border border-line bg-white p-5 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">
            Clientes ativos
          </p>
          <div className="mt-3 flex items-end justify-between">
            <strong className="font-display text-4xl">{activeCount}</strong>
          </div>
        </article>

        <article className="rounded-card border border-line bg-white p-5 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">
            Prospectos
          </p>
          <div className="mt-3 flex items-end justify-between">
            <strong className="font-display text-4xl">
              {String(prospectCount).padStart(2, "0")}
            </strong>
          </div>
        </article>
      </section>

      {/* Table */}
      <ClientsTable data={tableData} />
    </div>
  );
};

export { ClientsData };
