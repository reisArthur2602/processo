"use client";

import { Bell, Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface DashboardHeaderProps {
  onOpenSidebar: () => void;
}

const DashboardHeader = ({ onOpenSidebar }: DashboardHeaderProps) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1);

  useEffect(() => {
    if (!notifOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (!notifRef.current?.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [notifOpen]);

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-line bg-white/95 px-5 backdrop-blur sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-xl border border-line text-ink hover:bg-mist lg:hidden"
          aria-label="Abrir menu"
          onClick={onOpenSidebar}
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-xs font-semibold text-slate">{todayCapitalized}</p>
        </div>
      </div>

      <div className="relative" ref={notifRef}>
        <button
          type="button"
          className="relative grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-slate hover:bg-mist hover:text-ink focus:outline-none focus:ring-2 focus:ring-navy"
          aria-label="Notificações"
          aria-expanded={notifOpen}
          onClick={() => setNotifOpen(!notifOpen)}
        >
          <Bell className="h-5 w-5" />
          <span
            className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-danger ring-2 ring-white"
            aria-hidden="true"
          />
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-[calc(100%+0.5rem)] w-[calc(100vw-2.5rem)] max-w-sm rounded-card border border-line bg-white p-4 shadow-panel sm:right-0">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Notificações</p>
              <span className="rounded-full bg-danger-soft px-2 py-1 text-[10px] font-bold text-danger">
                2 novas
              </span>
            </div>
            <div className="mt-3 space-y-2 text-sm">
              <Link
                href="/dashboard/andamentos"
                className="block rounded-xl bg-mist p-3 hover:bg-navy-soft"
                onClick={() => setNotifOpen(false)}
              >
                <strong className="block">Novo andamento</strong>
                <span className="mt-1 block text-xs text-slate">
                  Prazo aberto no processo de Marina Duarte.
                </span>
              </Link>
              <Link
                href="/dashboard/andamentos"
                className="block rounded-xl bg-mist p-3 hover:bg-navy-soft"
                onClick={() => setNotifOpen(false)}
              >
                <strong className="block">Documento anexado</strong>
                <span className="mt-1 block text-xs text-slate">
                  Contestação adicionada há 35 minutos.
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export { DashboardHeader };
