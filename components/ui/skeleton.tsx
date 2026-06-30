import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Skeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    aria-hidden="true"
    className={cn("animate-pulse rounded-control bg-line", className)}
    {...props}
  />
);

export { Skeleton };
