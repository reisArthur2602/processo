import { z } from "zod";

const SERVICE_AREAS = [
  "Cível",
  "Trabalhista",
  "Previdenciário",
  "Família e Sucessões",
  "Tributário",
  "Empresarial",
  "Consumidor",
  "Criminal",
  "Outro",
] as const;

export const createIntakeSchema = z.object({
  serviceArea: z.string().min(1, "Selecione a área de atendimento."),
});

export type CreateIntakeInput = z.infer<typeof createIntakeSchema>;
export { SERVICE_AREAS };
