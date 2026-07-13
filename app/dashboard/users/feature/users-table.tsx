"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Search, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { deleteUser } from "../actions/delete-user";
import { UserFormDialog } from "./user-form-dialog";
import { createUsersColumns, type UserRow } from "./users-columns";

interface UsersTableProps {
  data: UserRow[];
  currentUserId: string;
}

const ROLE_OPTIONS = [
  { value: "ALL", label: "Todas as funções" },
  { value: "ADMIN", label: "Administrador" },
  { value: "LAWYER", label: "Advogado" },
];

const UsersTable = ({ data, currentUserId }: UsersTableProps) => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const columns = useMemo(
    () =>
      createUsersColumns({
        currentUserId,
        onEdit: setEditingUser,
        onDelete: setDeletingUser,
      }),
    [currentUserId],
  );

  const columnFilters = useMemo(
    () => (roleFilter === "ALL" ? [] : [{ id: "admin", value: roleFilter }]),
    [roleFilter],
  );

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter: search, columnFilters },
    onGlobalFilterChange: setSearch,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const filteredRows = table.getFilteredRowModel().rows;
  const pageRows = table.getRowModel().rows;

  const handleClear = () => {
    setSearch("");
    setRoleFilter("ALL");
    table.resetPagination();
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    setDeleting(true);
    const result = await deleteUser(deletingUser.id);
    setDeleting(false);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    setDeletingUser(null);
  };

  return (
    <section
      className="overflow-hidden rounded-card border border-line bg-white shadow-panel"
      aria-labelledby="users-table-title"
    >
      {/* Header */}
      <div className="border-b border-line p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
          <div>
            <h2
              id="users-table-title"
              className="font-display text-2xl font-bold"
            >
              Todos os usuários
            </h2>
            <p
              className="mt-1 text-xs font-medium text-slate"
              aria-live="polite"
            >
              {filteredRows.length}{" "}
              {filteredRows.length === 1
                ? "usuário exibido"
                : "usuários exibidos"}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(260px,1fr)_180px]">
            <label className="relative block">
              <span className="sr-only">Buscar usuários</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
              <input
                type="search"
                placeholder="Buscar por nome"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="min-h-11 w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate/60 focus:border-navy focus:ring-4 focus:ring-navy/10"
              />
            </label>
            <label htmlFor="user-role-filter">
              <span className="sr-only">Filtrar por função</span>
              <Select
                id="user-role-filter"
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  table.resetPagination();
                }}
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </label>
          </div>
        </div>
      </div>

      {/* Table */}
      {pageRows.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead className="bg-mist text-[11px] font-bold uppercase tracking-[0.12em] text-slate">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-6 py-4">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-line text-sm">
              {pageRows.map((row) => (
                <tr key={row.id} className="transition hover:bg-navy-soft/40">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={<Search className="h-6 w-6" />}
          title="Nenhum resultado encontrado"
          description="Tente remover algum filtro ou buscar por outro nome."
          action={
            <button
              type="button"
              onClick={handleClear}
              className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-mist focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2"
            >
              Limpar filtros
            </button>
          }
        />
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-line px-5 py-4 text-xs text-slate sm:px-6">
        <span>
          {pageRows.length > 0
            ? `Mostrando ${pageRows.length} de ${filteredRows.length} usuários`
            : "Nenhum usuário encontrado"}
        </span>
        {pageRows.length > 0 && (
          <div className="flex items-center gap-3">
            <span>
              Página {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="grid h-8 w-8 place-items-center rounded-lg border border-line text-slate hover:bg-mist disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="grid h-8 w-8 place-items-center rounded-lg border border-line text-slate hover:bg-mist disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Próxima página"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit dialog */}
      <UserFormDialog
        user={editingUser}
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
      />

      {/* Delete confirmation */}
      <Dialog
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
      >
        <DialogContent>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-danger-soft text-danger">
            <TriangleAlert className="h-6 w-6" aria-hidden="true" />
          </div>
          <DialogTitle className="mt-4">Excluir usuário?</DialogTitle>
          <DialogDescription className="mt-2">
            Esta ação não pode ser desfeita. O usuário{" "}
            <strong className="font-semibold text-ink">
              {deletingUser?.name}
            </strong>{" "}
            perderá o acesso ao sistema.
          </DialogDescription>
          <DialogFooter className="mt-6 gap-3">
            <Button
              variant="outline"
              onClick={() => setDeletingUser(null)}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              loading={deleting}
            >
              Confirmar exclusão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export { UsersTable };
