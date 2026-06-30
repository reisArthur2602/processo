import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/get-session";

interface RedirectAuthOptions {
  fallback?: string;
}

export const redirectAuth = async (options: RedirectAuthOptions = {}) => {
  const { fallback = "/auth" } = options;
  const user = await getSession();

  if (!user) {
    redirect(fallback);
  }

  return user;
};

export const redirectIfAuthenticated = async (fallback = "/dashboard") => {
  const user = await getSession();

  if (user) {
    redirect(fallback);
  }
};
