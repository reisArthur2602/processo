"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect } from "react";
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
import { Select } from "@/components/ui/select";
import {
  ACTION_TYPES,
  type UpdateCaseInput,
  updateCaseSchema,
} from "@/schema/update-case-schema";
import { updateCase } from "../actions/update-case";

export type EditCaseInitialData = {
  actionType: string;
  court: string;
  division: string | null;
  claimValue: number | null;
  plaintiffName: string | null;
  defendantName: string | null;
};

interface EditCaseDialogProps {
  caseId: string;
  initialData: EditCaseInitialData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditCaseDialog = ({
  caseId,
  initialData,
  open,
  onOpenChange,
}: EditCaseDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateCaseInput>({
    resolver: zodResolver(updateCaseSchema),
  });

  useEffect(() => {
    if (open) {
      reset({
        actionType: initialData.actionType,
        court: initialData.court,
        division: initialData.division ?? "",
        plaintiffName: initialData.plaintiffName ?? "",
        defendantName: initialData.defendantName ?? "",
        claimValue: initialData.claimValue
          ? String(initialData.claimValue)
          : "",
      });
    }
  }, [open, reset, initialData]);

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (data: UpdateCaseInput) => {
    const result = await updateCase(caseId, data);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl overflow-hidden p-0 sm:p-0 [&>button:last-child]:hidden">
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy">
              Dados do processo
            </p>
            <DialogTitle className="mt-1">Editar processo</DialogTitle>
            <DialogDescription className="mt-1">
              Altere os dados cadastrais do processo. O número CNJ não pode ser
              modificado.
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
          className="max-h-[calc(100vh-12rem)] overflow-y-auto"
        >
          <div className="space-y-6 px-6 py-6">
            {/* Ação */}
            <fieldset>
              <legend className="text-sm font-bold uppercase tracking-[0.12em] text-slate">
                Processo
              </legend>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field className="sm:col-span-2">
                  <FieldLabel>Tipo de ação</FieldLabel>
                  <Select
                    {...register("actionType")}
                    status={errors.actionType ? "error" : "default"}
                  >
                    <option value="">Selecione o tipo de ação</option>
                    {ACTION_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Select>
                  <FieldError>{errors.actionType?.message}</FieldError>
                </Field>

                <Field>
                  <FieldLabel>Tribunal</FieldLabel>
                  <Input
                    {...register("court")}
                    placeholder="Ex.: TJRJ — 12ª Vara Cível"
                    status={errors.court ? "error" : "default"}
                  />
                  <FieldError>{errors.court?.message}</FieldError>
                </Field>

                <Field>
                  <FieldLabel>
                    Vara{" "}
                    <span className="text-xs font-normal text-slate">
                      (opcional)
                    </span>
                  </FieldLabel>
                  <Input
                    {...register("division")}
                    placeholder="Ex.: 3ª Vara do Trabalho"
                  />
                </Field>

                <Field className="sm:col-span-2">
                  <FieldLabel>
                    Valor da causa{" "}
                    <span className="text-xs font-normal text-slate">
                      (opcional)
                    </span>
                  </FieldLabel>
                  <Input
                    {...register("claimValue")}
                    placeholder="Ex.: 15000,00"
                    inputMode="decimal"
                    status={errors.claimValue ? "error" : "default"}
                  />
                  <FieldError>{errors.claimValue?.message}</FieldError>
                </Field>
              </div>
            </fieldset>

            <div className="border-t border-line" />

            {/* Partes */}
            <fieldset>
              <legend className="text-sm font-bold uppercase tracking-[0.12em] text-slate">
                Partes envolvidas
              </legend>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>Autor</FieldLabel>
                  <Input
                    {...register("plaintiffName")}
                    placeholder="Nome completo ou razão social"
                    status={errors.plaintiffName ? "error" : "default"}
                  />
                  <FieldError>{errors.plaintiffName?.message}</FieldError>
                </Field>

                <Field>
                  <FieldLabel>Réu</FieldLabel>
                  <Input
                    {...register("defendantName")}
                    placeholder="Nome completo ou razão social"
                    status={errors.defendantName ? "error" : "default"}
                  />
                  <FieldError>{errors.defendantName?.message}</FieldError>
                </Field>
              </div>
            </fieldset>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-line bg-mist/60 px-6 py-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Salvar alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { EditCaseDialog };
