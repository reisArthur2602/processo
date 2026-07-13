import { redirect } from "next/navigation";
import { cache } from "react";
import { getSession } from "@/lib/auth/get-session";
import prisma from "@/lib/prisma";
import { NewUserButton } from "./new-user-button";
import type { UserRow } from "./users-columns";
import { UsersTable } from "./users-table";

const getPageData = cache(async () => {
  return Promise.all([
    prisma.user.findMany({ orderBy: { name: "asc" } }),
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { admin: true } }),
  ]);
});

const UsersData = async () => {
  const session = await getSession();
  if (!session?.admin) {
    redirect("/dashboard/clients");
  }

  const [users, totalCount, activeCount, adminCount] = await getPageData();

  const tableData: UserRow[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    username: u.username,
    admin: u.admin,
    isActive: u.isActive,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-8">
      {/* Page header */}
      <section className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
        <div>
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-navy">
            <span className="h-px w-8 bg-docket" aria-hidden="true" />
            Escritório
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
            Usuários
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate">
            Gerencie os acessos de advogados e administradores do escritório.
          </p>
        </div>
        <NewUserButton />
      </section>

      {/* Stats */}
      <section
        className="grid gap-4 sm:grid-cols-3"
        aria-label="Resumo dos usuários"
      >
        <article className="rounded-card border border-line bg-white p-5 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">
            Total de usuários
          </p>
          <div className="mt-3 flex items-end justify-between">
            <strong className="font-display text-4xl">{totalCount}</strong>
          </div>
        </article>

        <article className="rounded-card border border-line bg-white p-5 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">
            Contas ativas
          </p>
          <div className="mt-3 flex items-end justify-between">
            <strong className="font-display text-4xl">{activeCount}</strong>
          </div>
        </article>

        <article className="rounded-card border border-line bg-white p-5 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">
            Administradores
          </p>
          <div className="mt-3 flex items-end justify-between">
            <strong className="font-display text-4xl">
              {String(adminCount).padStart(2, "0")}
            </strong>
          </div>
        </article>
      </section>

      {/* Table */}
      <UsersTable data={tableData} currentUserId={session.id} />
    </div>
  );
};

export { UsersData };
