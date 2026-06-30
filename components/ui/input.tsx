import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  status?: "default" | "error" | "success";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  prefix?: string;
  suffix?: string;
}

const inputBaseStyles =
  "w-full rounded-control border bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate/60 disabled:cursor-not-allowed disabled:bg-mist disabled:text-slate/60";

const statusStyles = {
  default: "border-line focus:border-navy focus:ring-4 focus:ring-navy/10",
  error: "border-danger bg-danger-soft focus:ring-4 focus:ring-danger/10",
  success: "border-success bg-success-soft focus:ring-4 focus:ring-success/10",
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      status = "default",
      leftIcon,
      rightIcon,
      prefix,
      suffix,
      ...props
    },
    ref,
  ) => {
    const hasLeft = leftIcon ?? prefix;
    const hasRight = rightIcon ?? suffix;

    const inputEl = (
      <input
        ref={ref}
        type={type}
        className={cn(
          inputBaseStyles,
          statusStyles[status],
          hasLeft && "pl-10",
          hasRight && "pr-10",
          className,
        )}
        {...props}
      />
    );

    if (!hasLeft && !hasRight) return inputEl;

    return (
      <div className="relative flex items-center">
        {hasLeft && (
          <span className="pointer-events-none absolute left-3.5 flex items-center text-slate [&_svg]:h-4 [&_svg]:w-4">
            {leftIcon ?? <span className="text-sm font-medium">{prefix}</span>}
          </span>
        )}
        {inputEl}
        {hasRight && (
          <span className="pointer-events-none absolute right-3.5 flex items-center text-slate [&_svg]:h-4 [&_svg]:w-4">
            {rightIcon ?? <span className="text-sm font-medium">{suffix}</span>}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
