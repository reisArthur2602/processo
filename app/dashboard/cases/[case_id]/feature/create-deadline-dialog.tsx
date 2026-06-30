"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type CreateDeadlineInput,
  createDeadlineSchema,
} from "@/schema/create-deadline-schema";
import { createDeadline } from "../actions/create-deadline";

interface CreateDeadlineDialogProps {
  caseId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateDeadlineDialog = ({
  caseId,
  open,
  onOpenChange,
}: CreateDeadlineDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateDeadlineInput>({
    resolver: zodResolver(createDeadlineSchema),
    defaultValues: { title: "", description: "", dueAt: "" },
  });

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (data: CreateDeadlineInput) => {
    const result = await createDeadline(caseId, data);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg overflow-hidden p-0 sm:p-0 [&>button:last-child]:hidden">
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy">
              Prazos
            </p>
            <DialogTitle className="mt-1">Criar prazo vinculado</DialogTitle>
            <DialogDescription className="mt-1">
              O prazo será associado a este processo e aparecerá no painel.
            </DialogDescription>
          </div>
          <DialogClose className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-slate hover:bg-mist hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-navy">
            <X className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Fechar</span>
          </DialogClose>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5 px-6 py-6"
        >
          <Field>
            <FieldLabel>Título do prazo</FieldLabel>
            <Input
              {...register("title")}
              placeholder="Ex.: Prazo para contestação"
              status={errors.title ? "error" : "default"}
            />
            <FieldError>{errors.title?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Data de vencimento</FieldLabel>
            <Input
              type="date"
              {...register("dueAt")}
              status={errors.dueAt ? "error" : "default"}
            />
            <FieldError>{errors.dueAt?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>
              Observações{" "}
              <span className="text-xs font-normal text-slate">(opcional)</span>
            </FieldLabel>
            <Textarea
              {...register("description")}
              rows={3}
              placeholder="Contexto adicional sobre este prazo."
            />
          </Field>

          <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={isSubmitting}>
              <Clock className="h-4 w-4" />
              Salvar prazo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { CreateDeadlineDialog };
