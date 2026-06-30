import { Plus } from "lucide-react";
import Link from "next/link";
import { cache } from "react";
import prisma from "@/lib/prisma";
import type { CaseRow } from "./cases-columns";
import { CasesTable } from "./cases-table";

const getPageData = cache(async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Promise.all([
    prisma.case.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        parties: {
          where: { partyType: "PLAINTIFF" },
          take: 1,
        },
        movements: {
          orderBy: { occurredAt: "desc" },
          take: 1,
        },
      },
    }),
    prisma.case.count(),
    prisma.case.count({ where: { status: "ACTIVE" } }),
    prisma.case.count({ where: { updatedAt: { gte: today } } }),
  ]);
});

const CasesData = async () => {
  const [cases, totalCount, activeCount, todayCount] = await getPageData();

  const tableData: CaseRow[] = cases.map((c) => ({
    id: c.id,
    number: c.number,
    actionType: c.actionType,
    status: c.status as CaseRow["status"],
    updatedAt: c.updatedAt.toISOString(),
    clientName: c.parties[0]?.name ?? "—",
    clientPersonType: (c.parties[0]?.personType ??
      "INDIVIDUAL") as CaseRow["clientPersonType"],
    lastMovement: c.movements[0]?.title ?? null,
  }));

  const activePercent =
    totalCount > 0 ? ((activeCount / totalCount) * 100).toFixed(1) : "0";

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
            Processos
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate">
            Consulte a situação da carteira, encontre um caso e acesse o
            histórico completo.
          </p>
        </div>
        <Link
          href="/dashboard/cases/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-navy px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-ink focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Cadastrar processo
        </Link>
      </section>

      {/* Stats */}
      <section
        className="grid gap-4 sm:grid-cols-3"
        aria-label="Resumo da carteira"
      >
        <article className="rounded-card border border-line bg-white p-5 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">
            Total da carteira
          </p>
          <div className="mt-3 flex items-end justify-between">
            <strong className="font-display text-4xl">{totalCount}</strong>
          </div>
        </article>

        <article className="rounded-card border border-line bg-white p-5 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">
            Processos ativos
          </p>
          <div className="mt-3 flex items-end justify-between">
            <strong className="font-display text-4xl">{activeCount}</strong>
            <span className="inline-flex items-center gap-2 rounded-full bg-success-soft px-2.5 py-1 text-xs font-bold text-success">
              <span
                className="h-1.5 w-1.5 rounded-full bg-success"
                aria-hidden="true"
              />
              {activePercent}%
            </span>
          </div>
        </article>

        <article className="rounded-card border border-line bg-white p-5 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">
            Atualizados hoje
          </p>
          <div className="mt-3 flex items-end justify-between">
            <strong className="font-display text-4xl">
              {String(todayCount).padStart(2, "0")}
            </strong>
          </div>
        </article>
      </section>

      {/* Table */}
      <CasesTable data={tableData} />
    </div>
  );
};

export { CasesData };
