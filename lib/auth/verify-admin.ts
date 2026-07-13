import { verifyAuth } from "@/lib/auth/verify-auth";

export const verifyAdmin = async () => {
  const user = await verifyAuth();

  if (!user.admin) {
    throw new Error("Acesso Negado");
  }

  return user;
};
