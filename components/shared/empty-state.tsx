import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center px-6 py-16 text-center",
      className,
    )}
  >
    {icon && (
      <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-navy-soft text-navy">
        {icon}
      </div>
    )}
    <h3 className="font-display text-2xl font-bold text-ink">{title}</h3>
    {description && (
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate">
        {description}
      </p>
    )}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export { EmptyState };
