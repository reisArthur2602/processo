"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
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

interface CaseFormProps {
  clientId: string;
  clientName: string;
}

const CaseForm = ({ clientId, clientName }: CaseFormProps) => {
  const router = useRouter();
  const [digitCount, setDigitCount] = useState(0);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CaseFormFields>({
    resolver: zodResolver(createCaseSchema.omit({ clientId: true })),
    defaultValues: {
      number: "",
      serviceArea: "",
      actionType: "",
      court: "",
      plaintiffName: "",
      defendantName: "",
    },
  });

  const onSubmit = async (data: CaseFormFields) => {
    const result = await createCase({ ...data, clientId });
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    router.push(
      result.data ? `/dashboard/cases/${result.data.id}` : "/dashboard/cases",
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="overflow-hidden rounded-card border border-line bg-white shadow-panel"
    >
      {/* Dark header */}
      <div className="border-b border-line bg-ink px-5 py-6 text-white sm:px-8">
        <div className="flex items-start gap-4">
          <div className="relative mt-1 h-16 w-4 shrink-0 border-l-2 border-docket">
            <span className="absolute -left-[5px] top-0 h-2 w-2 rounded-full bg-docket" />
            <span className="absolute -left-[5px] bottom-0 h-2 w-2 rounded-full bg-docket" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
              Dados principais
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold">
              Identificação dos autos
            </h2>
            <p className="mt-2 text-sm text-white/65">
              Campos marcados com * são obrigatórios.
            </p>
          </div>
        </div>
      </div>

      {/* Linked client */}
      <div className="flex items-center gap-3 border-b border-line bg-navy-soft/30 px-5 py-4 sm:px-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-navy">
          Cliente
        </span>
        <span className="font-semibold text-ink">{clientName}</span>
      </div>

      {/* Form body */}
      <div className="space-y-8 p-5 sm:p-8">
        <fieldset>
          <legend className="font-display text-2xl font-bold">Processo</legend>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {/* Process number — custom bottom row (help text + counter) */}
            <div className="lg:col-span-2">
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
                      aria-describedby={
                        errors.number ? "number-error" : "number-help"
                      }
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
                  <FieldError id="number-error">
                    {errors.number.message}
                  </FieldError>
                ) : (
                  <p id="number-help" className="text-xs text-slate">
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

            {/* Service area */}
            <Field>
              <FieldLabel htmlFor="serviceArea">
                Área de atuação{" "}
                <span className="text-danger" aria-hidden="true">
                  *
                </span>
              </FieldLabel>
              <Select
                id="serviceArea"
                status={errors.serviceArea ? "error" : "default"}
                aria-invalid={!!errors.serviceArea}
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

            {/* Action type */}
            <Field>
              <FieldLabel htmlFor="actionType">
                Tipo de ação{" "}
                <span className="text-danger" aria-hidden="true">
                  *
                </span>
              </FieldLabel>
              <Select
                id="actionType"
                status={errors.actionType ? "error" : "default"}
                aria-invalid={!!errors.actionType}
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

            {/* Court */}
            <Field>
              <FieldLabel htmlFor="court">
                Tribunal{" "}
                <span className="text-danger" aria-hidden="true">
                  *
                </span>
              </FieldLabel>
              <Input
                id="court"
                type="text"
                placeholder="Ex.: TJRJ — 12ª Vara Cível"
                status={errors.court ? "error" : "default"}
                aria-invalid={!!errors.court}
                {...register("court")}
              />
              <FieldError>{errors.court?.message}</FieldError>
            </Field>
          </div>
        </fieldset>

        <div className="border-t border-line" />

        <fieldset>
          <legend className="font-display text-2xl font-bold">
            Partes envolvidas
          </legend>
          <p className="mt-2 text-sm text-slate">
            Informe os nomes conforme aparecem nos autos.
          </p>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="plaintiffName">
                Autor{" "}
                <span className="text-danger" aria-hidden="true">
                  *
                </span>
              </FieldLabel>
              <Input
                id="plaintiffName"
                type="text"
                placeholder="Nome completo ou razão social"
                status={errors.plaintiffName ? "error" : "default"}
                aria-invalid={!!errors.plaintiffName}
                {...register("plaintiffName")}
              />
              <FieldError>{errors.plaintiffName?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="defendantName">
                Réu{" "}
                <span className="text-danger" aria-hidden="true">
                  *
                </span>
              </FieldLabel>
              <Input
                id="defendantName"
                type="text"
                placeholder="Nome completo ou razão social"
                status={errors.defendantName ? "error" : "default"}
                aria-invalid={!!errors.defendantName}
                {...register("defendantName")}
              />
              <FieldError>{errors.defendantName?.message}</FieldError>
            </Field>
          </div>
        </fieldset>
      </div>

      {/* Form footer */}
      <div className="flex flex-col-reverse justify-end gap-3 border-t border-line bg-mist px-5 py-5 sm:flex-row sm:px-8">
        <Link
          href={`/dashboard/clients/${clientId}`}
          className={buttonVariants({ variant: "outline" })}
        >
          Cancelar
        </Link>
        <Button type="submit" loading={isSubmitting}>
          {isSubmitting ? "Salvando processo" : "Salvar processo"}
          {!isSubmitting && (
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </div>
    </form>
  );
};

export { CaseForm };
