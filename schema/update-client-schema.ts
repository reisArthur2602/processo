import { z } from "zod";

export const updateClientSchema = z.object({
  personType: z.enum(["INDIVIDUAL", "COMPANY"]),
  status: z.enum(["ACTIVE", "INACTIVE", "PROSPECT"]),
  name: z.string().min(2, "Informe o nome ou razão social."),
  document: z.string().optional(),
  rg: z.string().optional(),
  birthDate: z.string().optional(),
  maritalStatus: z.string().optional(),
  profession: z.string().optional(),
  phone: z.string().optional(),
  email: z
    .string()
    .optional()
    .refine(
      (v) => !v || z.email().safeParse(v).success,
      "Informe um e-mail válido.",
    ),
  zipCode: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  notes: z.string().optional(),
});

export type UpdateClientInput = z.infer<typeof updateClientSchema>;
