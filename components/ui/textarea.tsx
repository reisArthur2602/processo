import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  status?: "default" | "error" | "success";
}

const statusStyles = {
  default: "border-line focus:border-navy focus:ring-4 focus:ring-navy/10",
  error: "border-danger bg-danger-soft focus:ring-4 focus:ring-danger/10",
  success: "border-success bg-success-soft focus:ring-4 focus:ring-success/10",
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, status = "default", ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-control border bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate/60",
        "resize-y min-h-[100px]",
        "disabled:cursor-not-allowed disabled:bg-mist disabled:text-slate/60",
        statusStyles[status],
        className,
      )}
      {...props}
    />
  ),
);

Textarea.displayName = "Textarea";

export { Textarea };
