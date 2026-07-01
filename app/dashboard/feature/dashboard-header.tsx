"use client";

import { Menu } from "lucide-react";

interface DashboardHeaderProps {
  onOpenSidebar: () => void;
}

const DashboardHeader = ({ onOpenSidebar }: DashboardHeaderProps) => {
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center border-b border-line bg-white/95 px-5 backdrop-blur sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-xl border border-line text-ink hover:bg-mist lg:hidden"
          aria-label="Abrir menu"
          onClick={onOpenSidebar}
        >
          <Menu className="h-5 w-5" />
        </button>
        <p className="text-xs font-semibold text-slate">{todayCapitalized}</p>
      </div>
    </header>
  );
};

export { DashboardHeader };
