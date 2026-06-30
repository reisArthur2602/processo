import { ChevronDown } from "lucide-react";
import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  status?: "default" | "error" | "success";
}

const statusStyles = {
  default: "border-line focus:border-navy focus:ring-4 focus:ring-navy/10",
  error: "border-danger bg-danger-soft focus:ring-4 focus:ring-danger/10",
  success: "border-success bg-success-soft focus:ring-4 focus:ring-success/10",
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, status = "default", children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "w-full appearance-none rounded-control border bg-white px-4 py-3 pr-10 text-sm font-medium text-ink outline-none transition",
          "disabled:cursor-not-allowed disabled:bg-mist disabled:text-slate/60",
          statusStyles[status],
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate"
      />
    </div>
  ),
);

Select.displayName = "Select";

export { Select };
