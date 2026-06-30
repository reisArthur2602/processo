import { createColumnHelper } from "@tanstack/react-table";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CnjNumber } from "@/components/shared/cnj-number";
import { Badge } from "@/components/ui/badge";

export type CaseRow = {
  id: string;
  number: string;
  actionType: string;
  status: "ACTIVE" | "SUSPENDED" | "ARCHIVED";
  updatedAt: string;
  clientName: string;
  clientPersonType: "INDIVIDUAL" | "COMPANY";
  lastMovement: string | null;
};

const STATUS_LABELS: Record<CaseRow["status"], string> = {
  ACTIVE: "Ativo",
  SUSPENDED: "Suspenso",
  ARCHIVED: "Arquivado",
};

const STATUS_VARIANTS = {
  ACTIVE: "active",
  SUSPENDED: "suspended",
  ARCHIVED: "archived",
} as const;

const formatDate = (iso: string) => {
  const date = new Date(iso);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const dateStart = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const time = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (dateStart.getTime() === todayStart.getTime()) return `Hoje, ${time}`;
  if (dateStart.getTime() === yesterdayStart.getTime()) return `Ontem, ${time}`;

  const shortDate = date
    .toLocaleDateString("pt-BR", { day: "numeric", month: "short" })
    .replace(".", "");
  return `${shortDate}, ${time}`;
};

const columnHelper = createColumnHelper<CaseRow>();

export const casesColumns = [
  columnHelper.accessor("number", {
    header: "Número do processo",
    enableGlobalFilter: true,
    cell: ({ row }) => (
      <Link href={`/dashboard/cases/${row.original.id}`}>
        <CnjNumber
          value={row.original.number}
          className="hover:text-ink hover:underline"
        />
      </Link>
    ),
  }),
  columnHelper.accessor("clientName", {
    header: "Cliente",
    enableGlobalFilter: true,
    cell: ({ row }) => (
      <div>
        <p className="font-semibold">{row.original.clientName}</p>
        <p className="mt-1 text-xs text-slate">
          {row.original.clientPersonType === "INDIVIDUAL"
            ? "Pessoa física"
            : "Pessoa jurídica"}
        </p>
      </div>
    ),
  }),
  columnHelper.accessor("actionType", {
    header: "Tipo de ação",
    enableGlobalFilter: true,
    cell: ({ getValue }) => <span className="text-slate">{getValue()}</span>,
  }),
  columnHelper.accessor("updatedAt", {
    header: "Última atualização",
    enableGlobalFilter: false,
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{formatDate(row.original.updatedAt)}</p>
        {row.original.lastMovement && (
          <p className="mt-1 text-xs text-slate">{row.original.lastMovement}</p>
        )}
      </div>
    ),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    enableGlobalFilter: false,
    filterFn: (row, _columnId, filterValue) =>
      row.original.status === filterValue,
    cell: ({ getValue }) => {
      const status = getValue();
      return (
        <Badge variant={STATUS_VARIANTS[status]} dot>
          {STATUS_LABELS[status]}
        </Badge>
      );
    },
  }),
  columnHelper.display({
    id: "actions",
    header: () => <span className="sr-only">Ações</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Link
          href={`/dashboard/cases/${row.original.id}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate hover:bg-navy-soft hover:text-ink"
          aria-label={`Ver processo ${row.original.number}`}
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    ),
  }),
];
