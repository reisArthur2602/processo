import { Check } from "lucide-react";
import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, id, ...props }, ref) => (
    <div className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center">
      <input
        id={id}
        type="checkbox"
        ref={ref}
        className="peer absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
        {...props}
      />
      <div
        aria-hidden="true"
        className={cn(
          "h-4 w-4 rounded border border-line bg-white transition-colors",
          "peer-checked:border-navy peer-checked:bg-navy",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-navy peer-focus-visible:ring-offset-2",
          "peer-disabled:opacity-50",
          className,
        )}
      />
      <Check
        aria-hidden="true"
        className="absolute h-2.5 w-2.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
      />
    </div>
  ),
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
