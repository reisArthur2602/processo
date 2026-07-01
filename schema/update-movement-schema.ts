import { z } from "zod";
import { MOVEMENT_TYPES } from "./add-movement-schema";

export const updateMovementSchema = z.object({
  title: z.string().min(1, "Informe o título da movimentação."),
  movementType: z.enum(MOVEMENT_TYPES, {
    error: "Selecione o tipo de movimentação.",
  }),
  occurredAt: z.string().min(1, "Informe a data do evento."),
  description: z
    .string()
    .min(10, "Informe uma descrição com pelo menos 10 caracteres."),
});

export type UpdateMovementInput = z.infer<typeof updateMovementSchema>;
