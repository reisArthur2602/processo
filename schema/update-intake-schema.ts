import { z } from "zod";

const PROVIDENCE_TYPES = [
  "REQUEST_DOCUMENTS",
  "PREPARE_LEGAL_OPINION",
  "SCHEDULE_RETURN",
  "PREPARE_CONTRACT",
  "FILE_LAWSUIT",
  "SETTLEMENT_ATTEMPT",
  "OTHER",
] as const;

const PAYMENT_METHODS = [
  "CASH",
  "PIX",
  "BANK_TRANSFER",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "BOLETO",
  "INSTALLMENTS",
  "OTHER",
] as const;

const INTAKE_STATUSES = [
  "DRAFT",
  "OPEN",
  "FINALIZED",
  "CONVERTED",
  "CANCELED",
] as const;

const decimalString = z
  .string()
  .optional()
  .refine(
    (v) => !v || /^\d+([.,]\d{1,2})?$/.test(v.trim()),
    "Informe um valor válido (ex.: 1500,00).",
  );

export const updateIntakeSchema = z.object({
  clientReport: z.string().optional(),
  preliminaryAnalysis: z.string().optional(),
  providences: z.array(z.enum(PROVIDENCE_TYPES)),
  otherProvidence: z.string().optional(),
  feeAmount: decimalString,
  amountReceived: decimalString,
  paymentMethod: z.enum(PAYMENT_METHODS).optional().or(z.literal("")),
  paymentNotes: z.string().optional(),
});

export type UpdateIntakeInput = z.infer<typeof updateIntakeSchema>;
export { PROVIDENCE_TYPES, PAYMENT_METHODS, INTAKE_STATUSES };
