import { z } from "zod";

export const createUserSchema = z
  .object({
    name: z.string().min(2, "Informe o nome completo."),
    username: z
      .string()
      .min(3, "O usuário deve ter pelo menos 3 caracteres.")
      .regex(
        /^[a-z0-9._-]+$/i,
        "Use apenas letras, números, ponto, hífen ou underline.",
      ),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
    confirmPassword: z.string(),
    admin: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;
