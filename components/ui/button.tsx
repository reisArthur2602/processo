import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-control text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
  {
    variants: {
      variant: {
        default:
          "bg-navy text-white shadow-sm hover:bg-ink focus-visible:ring-navy",
        secondary:
          "border border-navy bg-navy-soft text-navy hover:bg-navy hover:text-white focus-visible:ring-navy",
        outline:
          "border border-line bg-white text-ink hover:bg-mist hover:border-slate/50 focus-visible:ring-navy",
        ghost: "text-ink hover:bg-mist focus-visible:ring-navy",
        destructive:
          "bg-danger text-white hover:bg-danger/90 focus-visible:ring-danger",
        soft: "bg-navy-soft text-navy hover:bg-navy-soft/70 focus-visible:ring-navy",
        link: "text-navy underline-offset-4 hover:underline hover:text-ink focus-visible:ring-navy p-0 h-auto",
      },
      size: {
        sm: "h-9 px-4 py-2 text-xs",
        default: "min-h-11 px-5 py-2.5",
        lg: "min-h-12 px-6 py-3",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, loading = false, disabled, children, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          aria-hidden="true"
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M12 3a9 9 0 0 1 9 9h-3a6 6 0 0 0-6-6V3Z"
          />
        </svg>
      )}
      {children}
    </button>
  ),
);

Button.displayName = "Button";

export { Button, buttonVariants };
