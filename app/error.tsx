"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/shared/error-state";

const GlobalError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center px-5">
      <ErrorState
        title="Algo deu errado"
        description="Ocorreu um erro inesperado. Tente novamente em instantes."
        onRetry={reset}
        className="w-full max-w-md rounded-card border border-line bg-white shadow-panel"
      />
    </div>
  );
};

export default GlobalError;
