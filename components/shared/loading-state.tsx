import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  rows?: number;
  className?: string;
}

const SKELETON_IDS = [
  "s1",
  "s2",
  "s3",
  "s4",
  "s5",
  "s6",
  "s7",
  "s8",
  "s9",
  "s10",
];

const LoadingState = ({ rows = 3, className }: LoadingStateProps) => (
  <div className={cn("space-y-3", className)} aria-busy="true">
    <span className="sr-only">Carregando</span>
    {SKELETON_IDS.slice(0, rows).map((id) => (
      <div key={id} className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export { LoadingState };
