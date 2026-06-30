import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CnjNumberProps extends HTMLAttributes<HTMLSpanElement> {
  value: string;
}

const CnjNumber = ({ value, className, ...props }: CnjNumberProps) => (
  <span
    className={cn("font-mono text-xs font-semibold text-navy", className)}
    {...props}
  >
    {value}
  </span>
);

export { CnjNumber };
