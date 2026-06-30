"use client";

import { FileText, LogOut, Plus, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/dashboard/actions/logout";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const mainNav: NavItem[] = [
  { href: "/dashboard/cases", label: "Processos", icon: FileText, exact: true },
  {
    href: "/dashboard/cases/new",
    label: "Novo processo",
    icon: Plus,
    exact: true,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userInitials: string;
  isAdmin: boolean;
}

const Sidebar = ({
  isOpen,
  onClose,
  userName,
  userInitials,
  isAdmin,
}: SidebarProps) => {
  const pathname = usePathname();

  const isActive = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-[268px] flex-col bg-ink text-white transition-transform duration-200",
        "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      {/* Accent bar */}
      <div
        className="absolute inset-y-0 left-0 w-1.5 bg-docket"
        aria-hidden="true"
      />

      {/* Logo */}
      <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
        <Link
          href="/dashboard/cases"
          className="flex items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-ink"
        >
          <span
            className="grid h-10 w-10 place-items-center rounded-xl bg-white text-ink"
            aria-hidden="true"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M6 4h12M8 4v16m8-16v16M5 20h14M10 8h4M10 12h4M10 16h4" />
            </svg>
          </span>
          <span>
            <span className="block font-display text-xl font-bold leading-none">
              Processo
            </span>
            <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.24em] text-white/50">
              Sistema jurídico
            </span>
          </span>
        </Link>

        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white lg:hidden"
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6" aria-label="Menu principal">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
          Escritório
        </p>

        {mainNav.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition",
                active
                  ? "bg-white/10 font-semibold text-white"
                  : "font-medium text-white/65 hover:bg-white/5 hover:text-white",
              )}
              onClick={onClose}
            >
              <item.icon
                className={cn("h-5 w-5", active ? "text-docket" : "")}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User profile */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <div
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-docket text-sm font-bold text-ink"
            aria-hidden="true"
          >
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{userName}</p>
            <p className="truncate text-xs text-white/45">
              {isAdmin ? "Administrador" : "Advogado"}
            </p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg p-2 text-white/45 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Sair"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
};

export { Sidebar };
