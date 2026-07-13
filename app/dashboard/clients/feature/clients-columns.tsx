import { createColumnHelper } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDocument, formatPhone } from "@/lib/format";

export type ClientRow = {
  id: string;
  personType: "INDIVIDUAL" | "COMPANY";
  status: "ACTIVE" | "INACTIVE" | "PROSPECT";
  name: string;
  document: string | null;
  rg: string | null;
  birthDate: string | null;
  maritalStatus: string | null;
  profession: string | null;
  phone: string | null;
  email: string | null;
  zipCode: string | null;
  street: string | null;
  number: string | null;
  complement: string | null;
  district: string | null;
  city: string | null;
  state: string | null;
  notes: string | null;
  casesCount: number;
  updatedAt: string;
};

const STATUS_LABELS: Record<ClientRow["status"], string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  PROSPECT: "Prospecto",
};

const STATUS_VARIANTS = {
  ACTIVE: "success",
  INACTIVE: "neutral",
  PROSPECT: "warning",
} as const;

const columnHelper = createColumnHelper<ClientRow>();

interface ClientsColumnsOptions {
  onEdit: (client: ClientRow) => void;
  onDelete: (client: ClientRow) => void;
}

export const createClientsColumns = ({
  onEdit,
  onDelete,
}: ClientsColumnsOptions) => [
  columnHelper.accessor("name", {
    header: "Cliente",
    enableGlobalFilter: true,
    cell: ({ row }) => (
      <Link
        href={`/dashboard/clients/${row.original.id}`}
        className="block hover:underline"
      >
        <p className="font-semibold">{row.original.name}</p>
        <p className="mt-1 text-xs text-slate">
          {row.original.personType === "INDIVIDUAL"
            ? "Pessoa física"
            : "Pessoa jurídica"}
          {row.original.document
            ? ` · ${formatDocument(row.original.document)}`
            : ""}
        </p>
      </Link>
    ),
  }),
  columnHelper.display({
    id: "contact",
    header: "Contato",
    cell: ({ row }) => (
      <div>
        <p>{row.original.phone ? formatPhone(row.original.phone) : "—"}</p>
        <p className="mt-1 text-xs text-slate">{row.original.email ?? "—"}</p>
      </div>
    ),
  }),
  columnHelper.display({
    id: "location",
    header: "Localidade",
    enableGlobalFilter: false,
    cell: ({ row }) =>
      row.original.city
        ? `${row.original.city}${row.original.state ? `/${row.original.state}` : ""}`
        : "—",
  }),
  columnHelper.accessor("casesCount", {
    header: "Processos",
    enableGlobalFilter: false,
    cell: ({ getValue }) => <span className="text-slate">{getValue()}</span>,
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
      <div className="flex justify-end gap-1">
        <button
          type="button"
          onClick={() => onEdit(row.original)}
          aria-label={`Editar ${row.original.name}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate hover:bg-navy-soft hover:text-ink"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(row.original)}
          aria-label={`Excluir ${row.original.name}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate hover:bg-danger-soft hover:text-danger"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ),
  }),
];
