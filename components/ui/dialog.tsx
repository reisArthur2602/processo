"use client";

import { X } from "lucide-react";
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
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type DialogContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DialogContext = createContext<DialogContextValue>({
  open: false,
  onOpenChange: () => {},
});

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  children: ReactNode;
}

const Dialog = ({
  open: controlledOpen,
  onOpenChange: controlledOnChange,
  defaultOpen = false,
  children,
}: DialogProps) => {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? (controlledOpen ?? false) : uncontrolled;

  const onOpenChange = (value: boolean) => {
    if (!isControlled) setUncontrolled(value);
    controlledOnChange?.(value);
  };

  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

const DialogTrigger = ({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { onOpenChange } = useContext(DialogContext);
  return (
    <button
      type="button"
      className={className}
      onClick={() => onOpenChange(true)}
      {...props}
    >
      {children}
    </button>
  );
};

const DialogClose = ({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { onOpenChange } = useContext(DialogContext);
  return (
    <button
      type="button"
      className={cn(className)}
      onClick={() => onOpenChange(false)}
      {...props}
    >
      {children}
    </button>
  );
};

const DialogContent = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  const { open, onOpenChange } = useContext(DialogContext);
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement;
    const el = contentRef.current;
    const focusable = el?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable?.[0]?.focus();
    return () => prev?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onOpenChange]);

  if (!mounted || !open) return null;

  return createPortal(
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-50 bg-ink/55 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
          "rounded-card border border-line bg-white p-6 shadow-dialog sm:p-8",
          className,
        )}
        {...props}
      >
        {children}
        <DialogClose className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-lg text-slate hover:bg-mist hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy">
          <X aria-hidden="true" className="h-5 w-5" />
          <span className="sr-only">Fechar</span>
        </DialogClose>
      </div>
    </>,
    document.body,
  );
};

const DialogHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mb-4 flex flex-col gap-1", className)} {...props} />
);

const DialogTitle = ({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h2
    className={cn("font-display text-2xl font-bold text-ink", className)}
    {...props}
  />
);

const DialogDescription = ({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm leading-6 text-slate", className)} {...props} />
);

const DialogFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
      className,
    )}
    {...props}
  />
);

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};
