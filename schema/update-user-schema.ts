import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(2, "Informe o nome completo."),
  admin: z.boolean(),
  isActive: z.boolean(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
