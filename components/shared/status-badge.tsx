import { cn } from "@/lib/utils";

type Status = "active" | "suspended" | "archived";

const config: Record<
  Status,
  { label: string; className: string; dotClass: string }
> = {
  active: {
    label: "Ativo",
    className: "bg-success-soft text-success",
    dotClass: "bg-success",
  },
  suspended: {
    label: "Suspenso",
    className: "bg-warning-soft text-warning",
    dotClass: "bg-warning",
  },
  archived: {
    label: "Arquivado",
    className: "bg-slate/10 text-slate",
    dotClass: "bg-slate",
  },
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const { label, className: variantClass, dotClass } = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold",
        variantClass,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("h-1.5 w-1.5 rounded-full", dotClass)}
      />
      {label}
    </span>
  );
};

export { StatusBadge, type Status };
