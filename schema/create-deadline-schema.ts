import { z } from "zod";

export const createDeadlineSchema = z.object({
  title: z.string().min(1, "Informe o título do prazo."),
  description: z.string().optional(),
  dueAt: z.string().min(1, "Informe a data de vencimento."),
});

export type CreateDeadlineInput = z.infer<typeof createDeadlineSchema>;
