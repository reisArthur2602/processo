"use client";

import { FileText, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DialogExamples = () => (
  <div className="grid gap-5 sm:grid-cols-2">
    {/* Dialog */}
    <div className="rounded-card border border-line bg-white p-6 shadow-panel">
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-slate">
        Dialog
      </p>
      <p className="mb-4 text-sm text-slate">
        Janela modal com focus trap e Escape para fechar.
      </p>

      <Dialog>
        <DialogTrigger className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2">
          <FileText className="h-4 w-4" />
          Abrir dialog
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-navy">
              Recuperação
            </p>
            <DialogTitle>Confirmar ação</DialogTitle>
            <DialogDescription>
              Esta ação é apenas demonstrativa. No produto real, um link seria
              enviado para o e-mail cadastrado.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose className="inline-flex min-h-11 items-center justify-center rounded-control border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2">
              Cancelar
            </DialogClose>
            <DialogClose className="inline-flex min-h-11 items-center justify-center rounded-control bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2">
              Confirmar
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    {/* Dropdown */}
    <div className="rounded-card border border-line bg-white p-6 shadow-panel">
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-slate">
        Dropdown Menu
      </p>
      <p className="mb-4 text-sm text-slate">
        Menu contextual com teclado e click-outside.
      </p>

      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex h-10 w-10 items-center justify-center rounded-control border border-line bg-white text-slate hover:bg-mist hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy">
          <MoreHorizontal className="h-5 w-5" />
          <span className="sr-only">Mais opções</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Processo</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => {}}>
            <Pencil className="h-4 w-4" />
            Editar dados
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => {}}>
            <FileText className="h-4 w-4" />
            Gerar relatório
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem destructive onSelect={() => {}}>
            <Trash2 className="h-4 w-4" />
            Excluir processo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
);

export { DialogExamples };
