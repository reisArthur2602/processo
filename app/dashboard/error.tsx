"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/shared/error-state";

const DashboardError = ({
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
    <ErrorState
      title="Algo deu errado"
      description="Ocorreu um erro inesperado nesta página. Tente novamente ou volte para o painel."
      onRetry={reset}
      className="rounded-card border border-line bg-white shadow-panel"
    />
  );
};

export default DashboardError;
