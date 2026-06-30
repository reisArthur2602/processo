import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full text-xs font-bold",
  {
    variants: {
      variant: {
        default: "bg-navy-soft px-3 py-1.5 text-navy",
        active: "bg-success-soft px-3 py-1.5 text-success",
        suspended: "bg-warning-soft px-3 py-1.5 text-warning",
        archived: "bg-slate/10 px-3 py-1.5 text-slate",
        success: "bg-success-soft px-3 py-1.5 text-success",
        warning: "bg-warning-soft px-3 py-1.5 text-warning",
        danger: "bg-danger-soft px-3 py-1.5 text-danger",
        neutral: "bg-mist px-3 py-1.5 text-slate",
        outline: "border border-line bg-white px-3 py-1.5 text-ink",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

const Badge = ({
  className,
  variant,
  dot = false,
  children,
  ...props
}: BadgeProps) => (
  <span className={cn(badgeVariants({ variant, className }))} {...props}>
    {dot && (
      <span
        aria-hidden="true"
        className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current"
      />
    )}
    {children}
  </span>
);

export { Badge, badgeVariants };
