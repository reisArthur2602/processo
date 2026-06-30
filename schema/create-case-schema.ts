import { z } from "zod";

const CNJ_REGEX = /^\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}$/;

export const createCaseSchema = z.object({
  number: z
    .string()
    .regex(CNJ_REGEX, "Informe o número completo no padrão CNJ."),
  actionType: z.string().min(1, "Selecione o tipo de ação."),
  court: z.string().min(3, "Informe o tribunal ou a vara."),
  plaintiffName: z.string().min(2, "Informe o autor do processo."),
  defendantName: z.string().min(2, "Informe o réu do processo."),
});

export type CreateCaseInput = z.infer<typeof createCaseSchema>;
