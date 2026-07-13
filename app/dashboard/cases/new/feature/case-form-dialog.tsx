"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { cn } from "@/lib/utils";
import {
  type CreateCaseInput,
  createCaseSchema,
} from "@/schema/create-case-schema";
import { SERVICE_AREAS } from "@/schema/create-intake-schema";
import { createCase } from "../actions/create-case";

const ACTION_TYPES = [
  "Ação de cobrança",
  "Obrigação de fazer",
  "Indenização por danos materiais",
  "Reclamação trabalhista",
  "Ação revisional",
  "Outro",
];

type CaseFormFields = Omit<CreateCaseInput, "clientId">;

const EMPTY_VALUES: CaseFormFields = {
  number: "",
  serviceArea: "",
  actionType: "",
  court: "",
  plaintiffName: "",
  defendantName: "",
};

interface CaseFormDialogProps {
  clientId: string;
  clientName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatCNJ = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 20);
  const parts: string[] = [];
  if (digits.length > 0) parts.push(digits.slice(0, 7));
  if (digits.length > 7) parts.push(`-${digits.slice(7, 9)}`);
  if (digits.length > 9) parts.push(`.${digits.slice(9, 13)}`);
  if (digits.length > 13) parts.push(`.${digits.slice(13, 14)}`);
  if (digits.length > 14) parts.push(`.${digits.slice(14, 16)}`);
  if (digits.length > 16) parts.push(`.${digits.slice(16, 20)}`);
  return parts.join("");
};

const CaseFormDialog = ({
  clientId,
  clientName,
  open,
  onOpenChange,
}: CaseFormDialogProps) => {
  const router = useRouter();
  const [digitCount, setDigitCount] = useState(0);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CaseFormFields>({
    resolver: zodResolver(createCaseSchema.omit({ clientId: true })),
    defaultValues: EMPTY_VALUES,
  });

  const handleClose = () => {
    reset(EMPTY_VALUES);
    setDigitCount(0);
    onOpenChange(false);
  };

  const onSubmit = async (data: CaseFormFields) => {
    const result = await createCase({ ...data, clientId });
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    handleClose();
    if (result.data) router.push(`/dashboard/cases/${result.data.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl overflow-hidden p-0 sm:p-0 [&>button:last-child]:hidden">
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy">
              Processos
            </p>
            <DialogTitle className="mt-1">Cadastrar processo</DialogTitle>
            <DialogDescription className="mt-1">
              Registre um novo processo para{" "}
              <strong className="font-semibold text-ink">{clientName}</strong>.
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
            <fieldset>
              <legend className="text-sm font-bold uppercase tracking-[0.12em] text-slate">
                Processo
              </legend>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="number" className="text-sm font-semibold">
                    Número do processo{" "}
                    <span className="text-danger" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <div className="mt-1.5">
                    <Controller
                      control={control}
                      name="number"
                      render={({ field }) => (
                        <Input
                          id="number"
                          type="text"
                          inputMode="numeric"
                          maxLength={25}
                          autoComplete="off"
                          placeholder="0000000-00.0000.0.00.0000"
                          status={errors.number ? "error" : "default"}
                          aria-invalid={!!errors.number}
                          className="font-mono placeholder:font-sans"
                          value={field.value}
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          onChange={(e) => {
                            const formatted = formatCNJ(e.target.value);
                            field.onChange(formatted);
                            setDigitCount(formatted.replace(/\D/g, "").length);
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className="mt-1.5 flex flex-col justify-between gap-1 sm:flex-row">
                    {errors.number ? (
                      <FieldError>{errors.number.message}</FieldError>
                    ) : (
                      <p className="text-xs text-slate">
                        A máscara CNJ será aplicada automaticamente.
                      </p>
                    )}
                    <p
                      className={cn(
                        "font-mono text-[11px] font-semibold",
                        digitCount === 20 ? "text-success" : "text-slate",
                      )}
                    >
                      {digitCount}/20 dígitos
                    </p>
                  </div>
                </div>

                <Field>
                  <FieldLabel>
                    Área de atuação{" "}
                    <span className="text-danger" aria-hidden="true">
                      *
                    </span>
                  </FieldLabel>
                  <Select
                    status={errors.serviceArea ? "error" : "default"}
                    {...register("serviceArea")}
                  >
                    <option value="">Selecione a área de atuação</option>
                    {SERVICE_AREAS.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </Select>
                  <FieldError>{errors.serviceArea?.message}</FieldError>
                </Field>

                <Field>
                  <FieldLabel>
                    Tipo de ação{" "}
                    <span className="text-danger" aria-hidden="true">
                      *
                    </span>
                  </FieldLabel>
                  <Select
                    status={errors.actionType ? "error" : "default"}
                    {...register("actionType")}
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

                <Field className="sm:col-span-2">
                  <FieldLabel>
                    Tribunal{" "}
                    <span className="text-danger" aria-hidden="true">
                      *
                    </span>
                  </FieldLabel>
                  <Input
                    placeholder="Ex.: TJRJ — 12ª Vara Cível"
                    status={errors.court ? "error" : "default"}
                    {...register("court")}
                  />
                  <FieldError>{errors.court?.message}</FieldError>
                </Field>
              </div>
            </fieldset>

            <div className="border-t border-line" />

            <fieldset>
              <legend className="text-sm font-bold uppercase tracking-[0.12em] text-slate">
                Partes envolvidas
              </legend>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>
                    Autor{" "}
                    <span className="text-danger" aria-hidden="true">
                      *
                    </span>
                  </FieldLabel>
                  <Input
                    placeholder="Nome completo ou razão social"
                    status={errors.plaintiffName ? "error" : "default"}
                    {...register("plaintiffName")}
                  />
                  <FieldError>{errors.plaintiffName?.message}</FieldError>
                </Field>

                <Field>
                  <FieldLabel>
                    Réu{" "}
                    <span className="text-danger" aria-hidden="true">
                      *
                    </span>
                  </FieldLabel>
                  <Input
                    placeholder="Nome completo ou razão social"
                    status={errors.defendantName ? "error" : "default"}
                    {...register("defendantName")}
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
              Cadastrar processo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { CaseFormDialog };
