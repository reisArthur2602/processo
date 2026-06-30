import { getSession } from "@/lib/auth/get-session";

export const verifyAuth = async () => {
  const user = await getSession();

  if (!user) {
    throw new Error("Acesso Negado");
  }

  return user;
};
