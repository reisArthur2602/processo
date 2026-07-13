"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  PAYMENT_METHODS,
  PROVIDENCE_TYPES,
  type UpdateIntakeInput,
  updateIntakeSchema,
} from "@/schema/update-intake-schema";
import { updateIntake } from "../actions/update-intake";

const PROVIDENCE_LABELS: Record<(typeof PROVIDENCE_TYPES)[number], string> = {
  REQUEST_DOCUMENTS: "Solicitar documentos",
  PREPARE_LEGAL_OPINION: "Elaborar parecer jurídico",
  SCHEDULE_RETURN: "Agendar retorno",
  PREPARE_CONTRACT: "Elaborar contrato",
  FILE_LAWSUIT: "Ajuizar ação",
  SETTLEMENT_ATTEMPT: "Tentativa de acordo",
  OTHER: "Outro",
};

const PAYMENT_METHOD_LABELS: Record<(typeof PAYMENT_METHODS)[number], string> =
  {
    CASH: "Dinheiro",
    PIX: "Pix",
    BANK_TRANSFER: "Transferência bancária",
    CREDIT_CARD: "Cartão de crédito",
    DEBIT_CARD: "Cartão de débito",
    BOLETO: "Boleto",
    INSTALLMENTS: "Parcelado",
    OTHER: "Outro",
  };

interface IntakeFormProps {
  clientId: string;
  intakeId: string;
  initialData: UpdateIntakeInput;
}

const IntakeForm = ({ clientId, intakeId, initialData }: IntakeFormProps) => {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateIntakeInput>({
    resolver: zodResolver(updateIntakeSchema),
    defaultValues: initialData,
  });

  const providences = watch("providences");
  const showOtherProvidence = providences?.includes("OTHER");

  const onSubmit = async (data: UpdateIntakeInput) => {
    const result = await updateIntake(clientId, intakeId, data);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    router.push(`/dashboard/clients/${clientId}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="overflow-hidden rounded-card border border-line bg-white shadow-panel"
    >
      <div className="space-y-8 p-5 sm:p-8">
        {/* Relato e análise */}
        <fieldset>
          <legend className="font-display text-2xl font-bold">
            Relato e análise
          </legend>
          <div className="mt-5 grid gap-5">
            <Field>
              <FieldLabel htmlFor="clientReport">
                Relato do cliente{" "}
                <span className="text-xs font-normal text-slate">
                  (opcional)
                </span>
              </FieldLabel>
              <Textarea
                id="clientReport"
                rows={4}
                maxLength={1800}
                placeholder="Descreva o que o cliente relatou no atendimento"
                status={errors.clientReport ? "error" : "default"}
                {...register("clientReport")}
              />
              <FieldError>{errors.clientReport?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="preliminaryAnalysis">
                Análise preliminar{" "}
                <span className="text-xs font-normal text-slate">
                  (opcional)
                </span>
              </FieldLabel>
              <Textarea
                id="preliminaryAnalysis"
                rows={4}
                maxLength={1800}
                placeholder="Registre a análise jurídica preliminar do caso"
                status={errors.preliminaryAnalysis ? "error" : "default"}
                {...register("preliminaryAnalysis")}
              />
              <FieldError>{errors.preliminaryAnalysis?.message}</FieldError>
            </Field>
          </div>
        </fieldset>

        <div className="border-t border-line" />

        {/* Providências */}
        <fieldset>
          <legend className="font-display text-2xl font-bold">
            Providências
          </legend>
          <p className="mt-2 text-sm text-slate">
            Selecione as providências definidas para este atendimento.
          </p>

          <Controller
            control={control}
            name="providences"
            render={({ field }) => (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {PROVIDENCE_TYPES.map((type) => {
                  const checked = field.value?.includes(type) ?? false;
                  const inputId = `providence-${type}`;
                  return (
                    <label
                      key={type}
                      htmlFor={inputId}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-mist/60 p-3 text-sm"
                    >
                      <Checkbox
                        id={inputId}
                        checked={checked}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...(field.value ?? []), type]
                            : (field.value ?? []).filter((v) => v !== type);
                          field.onChange(next);
                        }}
                      />
                      {PROVIDENCE_LABELS[type]}
                    </label>
                  );
                })}
              </div>
            )}
          />

          {showOtherProvidence && (
            <Field className="mt-5">
              <FieldLabel htmlFor="otherProvidence">
                Descreva a outra providência
              </FieldLabel>
              <Textarea
                id="otherProvidence"
                rows={2}
                {...register("otherProvidence")}
              />
            </Field>
          )}
        </fieldset>

        <div className="border-t border-line" />

        {/* Financeiro */}
        <fieldset>
          <legend className="font-display text-2xl font-bold">
            Financeiro
          </legend>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="feeAmount">
                Honorários{" "}
                <span className="text-xs font-normal text-slate">
                  (opcional)
                </span>
              </FieldLabel>
              <Input
                id="feeAmount"
                inputMode="decimal"
                placeholder="Ex.: 1500,00"
                status={errors.feeAmount ? "error" : "default"}
                {...register("feeAmount")}
              />
              <FieldError>{errors.feeAmount?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="amountReceived">
                Valor recebido{" "}
                <span className="text-xs font-normal text-slate">
                  (opcional)
                </span>
              </FieldLabel>
              <Input
                id="amountReceived"
                inputMode="decimal"
                placeholder="Ex.: 500,00"
                status={errors.amountReceived ? "error" : "default"}
                {...register("amountReceived")}
              />
              <FieldError>{errors.amountReceived?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="paymentMethod">
                Forma de pagamento{" "}
                <span className="text-xs font-normal text-slate">
                  (opcional)
                </span>
              </FieldLabel>
              <Select id="paymentMethod" {...register("paymentMethod")}>
                <option value="">Selecione</option>
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {PAYMENT_METHOD_LABELS[method]}
                  </option>
                ))}
              </Select>
            </Field>

            <Field className="lg:col-span-2">
              <FieldLabel htmlFor="paymentNotes">
                Observações de pagamento{" "}
                <span className="text-xs font-normal text-slate">
                  (opcional)
                </span>
              </FieldLabel>
              <Textarea
                id="paymentNotes"
                rows={3}
                {...register("paymentNotes")}
              />
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
          {isSubmitting ? "Salvando ficha" : "Salvar ficha"}
          {!isSubmitting && (
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </div>
    </form>
  );
};

export { IntakeForm };
