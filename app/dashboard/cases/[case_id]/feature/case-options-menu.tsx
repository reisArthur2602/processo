"use client";

import {
  Archive,
  Clock,
  Pencil,
  RotateCcw,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteCase } from "../actions/delete-case";
import { updateCaseStatus } from "../actions/update-case-status";
import { CreateDeadlineDialog } from "./create-deadline-dialog";
import {
  EditCaseDialog,
  type EditCaseInitialData,
} from "./edit-case-dialog";

interface CaseOptionsMenuProps {
  caseId: string;
  status: "ACTIVE" | "SUSPENDED" | "ARCHIVED";
  caseNumber: string;
  initialData: EditCaseInitialData;
}

const CaseOptionsMenu = ({
  caseId,
  status,
  caseNumber,
  initialData,
}: CaseOptionsMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deadlineDialogOpen, setDeadlineDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  const handleStatusChange = async (
    newStatus: "ACTIVE" | "SUSPENDED" | "ARCHIVED",
  ) => {
    setMenuOpen(false);
    const result = await updateCaseStatus(caseId, newStatus);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const result = await deleteCase(caseId);
    if (result && !result.ok) {
      toast.error(result.message);
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <div ref={menuRef} className="relative">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label="Mais opções"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-slate hover:bg-mist hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="19" cy="12" r="1.5" />
          </svg>
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-72 overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-lift"
          >
            <div className="border-b border-line px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate">
                Ações do processo
              </p>
              <p className="mt-1 truncate font-mono text-xs font-semibold text-navy">
                {caseNumber}
              </p>
            </div>

            <MenuItem
              icon={<Pencil className="h-4 w-4 text-slate" />}
              onClick={() => {
                setMenuOpen(false);
                setEditDialogOpen(true);
              }}
            >
              Editar dados do processo
            </MenuItem>
            <MenuItem
              icon={<Clock className="h-4 w-4 text-slate" />}
              onClick={() => {
                setMenuOpen(false);
                setDeadlineDialogOpen(true);
              }}
            >
              Criar prazo vinculado
            </MenuItem>

            <hr className="my-1 border-t border-line" />

            {status !== "ACTIVE" && (
              <MenuItem
                icon={<RotateCcw className="h-4 w-4 text-slate" />}
                onClick={() => handleStatusChange("ACTIVE")}
              >
                Reativar processo
              </MenuItem>
            )}
            {status !== "SUSPENDED" && (
              <button
                type="button"
                role="menuitem"
                onClick={() => handleStatusChange("SUSPENDED")}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-warning hover:bg-warning-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-warning"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 12h8" />
                </svg>
                Marcar como suspenso
              </button>
            )}
            {status !== "ARCHIVED" && (
              <MenuItem
                icon={<Archive className="h-4 w-4 text-slate" />}
                onClick={() => handleStatusChange("ARCHIVED")}
              >
                Arquivar processo
              </MenuItem>
            )}

            <hr className="my-1 border-t border-line" />

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                setDeleteDialogOpen(true);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-danger hover:bg-danger-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-danger"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Excluir processo
            </button>
          </div>
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-danger-soft text-danger">
            <TriangleAlert className="h-6 w-6" aria-hidden="true" />
          </div>
          <DialogTitle className="mt-4">Excluir processo?</DialogTitle>
          <DialogDescription className="mt-2">
            Esta ação não pode ser desfeita. O processo{" "}
            <strong className="font-semibold text-ink">{caseNumber}</strong> e
            todos os dados associados — partes, movimentações, documentos e
            prazos — serão permanentemente removidos.
          </DialogDescription>
          <DialogFooter className="mt-6 gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
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

      <EditCaseDialog
        caseId={caseId}
        initialData={initialData}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <CreateDeadlineDialog
        caseId={caseId}
        open={deadlineDialogOpen}
        onOpenChange={setDeadlineDialogOpen}
      />
    </>
  );
};

const MenuItem = ({
  icon,
  onClick,
  children,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    role="menuitem"
    onClick={onClick}
    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-ink hover:bg-mist focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
  >
    {icon}
    {children}
  </button>
);

export { CaseOptionsMenu };
