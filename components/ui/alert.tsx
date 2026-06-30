import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const alertVariants = cva("rounded-control border p-4 text-sm", {
  variants: {
    variant: {
      default: "border-line bg-white text-ink",
      success: "border-success/40 bg-success-soft text-success",
      warning: "border-warning/25 bg-warning-soft text-warning",
      destructive: "border-danger/30 bg-danger-soft text-danger",
    },
  },
  defaultVariants: { variant: "default" },
});

const alertIcons = {
  default: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  destructive: AlertCircle,
};

interface AlertProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = ({
  className,
  variant = "default",
  children,
  ...props
}: AlertProps) => {
  const Icon = alertIcons[variant ?? "default"];

  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant, className }))}
      {...props}
    >
      <div className="flex items-start gap-3">
        <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

const AlertTitle = ({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <p className={cn("font-semibold leading-none", className)} {...props} />
);

const AlertDescription = ({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("mt-1 leading-5 opacity-90", className)} {...props} />
);

export { Alert, AlertDescription, AlertTitle };
