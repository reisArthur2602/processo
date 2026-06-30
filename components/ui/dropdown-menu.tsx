"use client";

import {
  type ButtonHTMLAttributes,
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

type DropdownContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DropdownContext = createContext<DropdownContextValue>({
  open: false,
  setOpen: () => {},
});

const DropdownMenu = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
};

const DropdownMenuTrigger = ({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { open, setOpen } = useContext(DropdownContext);
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-haspopup="menu"
      className={className}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
    </button>
  );
};

interface DropdownMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  align?: "start" | "end" | "center";
}

const DropdownMenuContent = ({
  className,
  children,
  align = "start",
  ...props
}: DropdownMenuContentProps) => {
  const { open, setOpen } = useContext(DropdownContext);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      role="menu"
      className={cn(
        "absolute top-full z-50 mt-1 min-w-45 rounded-card border border-line bg-white py-1 shadow-panel",
        align === "end" && "right-0",
        align === "center" && "left-1/2 -translate-x-1/2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface DropdownMenuItemProps extends HTMLAttributes<HTMLDivElement> {
  onSelect?: () => void;
  destructive?: boolean;
}

const DropdownMenuItem = ({
  className,
  children,
  onSelect,
  destructive = false,
  ...props
}: DropdownMenuItemProps) => {
  const { setOpen } = useContext(DropdownContext);

  const handle = () => {
    onSelect?.();
    setOpen(false);
  };

  return (
    <div
      role="menuitem"
      tabIndex={0}
      className={cn(
        "flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm font-medium transition",
        "focus-visible:bg-navy-soft focus-visible:text-navy focus-visible:outline-none",
        destructive
          ? "text-danger hover:bg-danger-soft"
          : "text-ink hover:bg-navy-soft hover:text-navy",
        className,
      )}
      onClick={handle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handle();
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
};

const DropdownMenuSeparator = ({ className }: { className?: string }) => (
  <hr className={cn("my-1 border-t border-line", className)} />
);

const DropdownMenuLabel = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate",
      className,
    )}
    {...props}
  />
);

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
};
