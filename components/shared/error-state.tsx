import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorState = ({
  title = "Algo deu errado",
  description = "Não foi possível carregar os dados. Tente novamente.",
  onRetry,
  className,
}: ErrorStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center px-6 py-16 text-center",
      className,
    )}
    role="alert"
  >
    <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-danger-soft text-danger">
      <AlertCircle aria-hidden="true" className="h-6 w-6" />
    </div>
    <h3 className="font-display text-2xl font-bold text-ink">{title}</h3>
    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate">
      {description}
    </p>
    {onRetry && (
      <Button variant="outline" className="mt-5" onClick={onRetry}>
        Tentar novamente
      </Button>
    )}
  </div>
);

export { ErrorState };
