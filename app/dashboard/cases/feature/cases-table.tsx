"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { Select } from "@/components/ui/select";
import { type CaseRow, casesColumns } from "./cases-columns";

interface CasesTableProps {
  data: CaseRow[];
}

const STATUS_OPTIONS = [
  { value: "ALL", label: "Todos os status" },
  { value: "ACTIVE", label: "Ativo" },
  { value: "SUSPENDED", label: "Suspenso" },
  { value: "ARCHIVED", label: "Arquivado" },
];

const CasesTable = ({ data }: CasesTableProps) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const columnFilters = useMemo(
    () =>
      statusFilter === "ALL" ? [] : [{ id: "status", value: statusFilter }],
    [statusFilter],
  );

  const table = useReactTable({
    data,
    columns: casesColumns,
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
    setStatusFilter("ALL");
    table.resetPagination();
  };

  return (
    <section
      className="overflow-hidden rounded-card border border-line bg-white shadow-panel"
      aria-labelledby="table-title"
    >
      {/* Header */}
      <div className="border-b border-line p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
          <div>
            <h2 id="table-title" className="font-display text-2xl font-bold">
              Todos os processos
            </h2>
            <p
              className="mt-1 text-xs font-medium text-slate"
              aria-live="polite"
            >
              {filteredRows.length}{" "}
              {filteredRows.length === 1
                ? "processo exibido"
                : "processos exibidos"}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(260px,1fr)_180px]">
            <label className="relative block">
              <span className="sr-only">Buscar processos</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
              <input
                type="search"
                placeholder="Buscar por processo, cliente ou ação"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="min-h-11 w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate/60 focus:border-navy focus:ring-4 focus:ring-navy/10"
              />
            </label>
            <label htmlFor="status-filter">
              <span className="sr-only">Filtrar por status</span>
              <Select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  table.resetPagination();
                }}
              >
                {STATUS_OPTIONS.map((opt) => (
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
          <table className="w-full min-w-[920px] border-collapse text-left">
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
          description="Tente remover algum filtro ou buscar por outro número, cliente ou tipo de ação."
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
            ? `Mostrando ${pageRows.length} de ${filteredRows.length} processos`
            : "Nenhum processo encontrado"}
        </span>
        {table.getPageCount() > 1 && (
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
    </section>
  );
};

export { CasesTable };
