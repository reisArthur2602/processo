import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.url("DATABASE_URL deve ser uma URL válida"),
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET deve ter pelo menos 32 caracteres"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  FTP_HOST: z.string().min(1, "FTP_HOST é obrigatório"),
  FTP_PORT: z.coerce.number().default(21),
  FTP_USER: z.string().min(1, "FTP_USER é obrigatório"),
  FTP_PASSWORD: z.string().min(1, "FTP_PASSWORD é obrigatório"),
  FTP_SECURE: z
    .string()
    .transform((v) => v === "true")
    .default(false),
  FTP_BASE_PATH: z.string().default("/processo"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  · ${i.path.join(".")}: ${i.message}`)
    .join("\n");
  throw new Error(`Variáveis de ambiente inválidas:\n${issues}`);
}

export const env = parsed.data;
