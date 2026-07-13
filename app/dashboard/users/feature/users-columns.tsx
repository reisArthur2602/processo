import { createColumnHelper } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type UserRow = {
  id: string;
  name: string;
  username: string;
  admin: boolean;
  isActive: boolean;
  createdAt: string;
};

const columnHelper = createColumnHelper<UserRow>();

interface UsersColumnsOptions {
  currentUserId: string;
  onEdit: (user: UserRow) => void;
  onDelete: (user: UserRow) => void;
}

export const createUsersColumns = ({
  currentUserId,
  onEdit,
  onDelete,
}: UsersColumnsOptions) => [
  columnHelper.accessor("name", {
    header: "Usuário",
    enableGlobalFilter: true,
    cell: ({ row }) => (
      <div>
        <p className="font-semibold">
          {row.original.name}
          {row.original.id === currentUserId && (
            <span className="ml-2 text-xs font-normal text-slate">(você)</span>
          )}
        </p>
        <p className="mt-1 text-xs text-slate">@{row.original.username}</p>
      </div>
    ),
  }),
  columnHelper.accessor("admin", {
    header: "Função",
    enableGlobalFilter: false,
    filterFn: (row, _columnId, filterValue) =>
      row.original.admin === (filterValue === "ADMIN"),
    cell: ({ getValue }) => (
      <Badge variant={getValue() ? "default" : "neutral"}>
        {getValue() ? "Administrador" : "Advogado"}
      </Badge>
    ),
  }),
  columnHelper.accessor("isActive", {
    header: "Status",
    enableGlobalFilter: false,
    cell: ({ getValue }) => (
      <Badge variant={getValue() ? "success" : "danger"} dot>
        {getValue() ? "Ativo" : "Inativo"}
      </Badge>
    ),
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
          disabled={row.original.id === currentUserId}
          aria-label={`Excluir ${row.original.name}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate hover:bg-danger-soft hover:text-danger disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ),
  }),
];
