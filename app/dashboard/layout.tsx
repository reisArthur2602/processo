import type { ReactNode } from "react";
import { redirectAuth } from "@/lib/auth/redirect-auth";
import { DashboardShell } from "./feature/dashboard-shell";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const user = await redirectAuth();

  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <DashboardShell
      userName={user.name}
      userInitials={initials}
      isAdmin={user.admin}
    >
      {children}
    </DashboardShell>
  );
};

export default DashboardLayout;
