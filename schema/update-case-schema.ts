import { z } from "zod";

const ACTION_TYPES = [
  "Ação de cobrança",
  "Obrigação de fazer",
  "Indenização por danos materiais",
  "Reclamação trabalhista",
  "Ação revisional",
  "Outro",
] as const;

export const updateCaseSchema = z.object({
  actionType: z.string().min(1, "Selecione o tipo de ação."),
  court: z.string().min(3, "Informe o tribunal ou a vara."),
  division: z.string().optional(),
  plaintiffName: z.string().min(2, "Informe o nome do autor."),
  defendantName: z.string().min(2, "Informe o nome do réu."),
  claimValue: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^\d+([.,]\d{1,2})?$/.test(v.trim()),
      "Informe um valor válido (ex.: 1500,00).",
    ),
});

export type UpdateCaseInput = z.infer<typeof updateCaseSchema>;
export { ACTION_TYPES };
