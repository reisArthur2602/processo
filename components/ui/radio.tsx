import {
  forwardRef,
  type HTMLAttributes,
  type InputHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

type RadioGroupItemProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

const RadioGroupItem = forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, id, ...props }, ref) => (
    <div className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center">
      <input
        id={id}
        type="radio"
        ref={ref}
        className="peer absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
        {...props}
      />
      <div
        aria-hidden="true"
        className={cn(
          "h-4 w-4 rounded-full border border-line bg-white transition-colors",
          "peer-checked:border-navy",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-navy peer-focus-visible:ring-offset-2",
          "peer-disabled:opacity-50",
          className,
        )}
      />
      <span
        aria-hidden="true"
        className="absolute h-2.5 w-2.5 rounded-full bg-navy opacity-0 transition-opacity peer-checked:opacity-100"
      />
    </div>
  ),
);

RadioGroupItem.displayName = "RadioGroupItem";

const RadioGroup = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div role="radiogroup" className={cn("grid gap-2", className)} {...props} />
);

RadioGroup.displayName = "RadioGroup";

export { RadioGroup, RadioGroupItem };
