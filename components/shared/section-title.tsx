import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SectionTitleProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  title: string;
  description?: string;
}

const SectionTitle = ({
  label,
  title,
  description,
  className,
  ...props
}: SectionTitleProps) => (
  <div className={cn("mb-7", className)} {...props}>
    {label && (
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-navy">
        {label}
      </p>
    )}
    <h2 className="mt-2 font-display text-3xl font-bold text-ink">{title}</h2>
    {description && (
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate">
        {description}
      </p>
    )}
  </div>
);

export { SectionTitle };
