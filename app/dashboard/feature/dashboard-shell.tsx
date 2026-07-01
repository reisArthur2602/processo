"use client";

import { type ReactNode, useState } from "react";
import { DashboardHeader } from "@/app/dashboard/feature/dashboard-header";
import { Sidebar } from "@/app/dashboard/feature/sidebar";

interface DashboardShellProps {
  children: ReactNode;
  userName: string;
  userInitials: string;
  isAdmin: boolean;
}

const DashboardShell = ({
  children,
  userName,
  userInitials,
  isAdmin,
}: DashboardShellProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col lg:grid lg:grid-cols-[268px_1fr]">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm lg:hidden"
          aria-label="Fechar menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={userName}
        userInitials={userInitials}
        isAdmin={isAdmin}
      />

      <div className="min-w-0">
        <DashboardHeader onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="px-5 py-8 sm:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
};

export { DashboardShell };
