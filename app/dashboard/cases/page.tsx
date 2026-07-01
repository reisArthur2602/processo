import type { Metadata } from "next";
import { Suspense } from "react";
import { CasesData } from "./feature/cases-data";
import { CasesSkeleton } from "./feature/cases-skeleton";

export const metadata: Metadata = {
  title: "Processos",
  description: "Visualize e gerencie todos os processos do escritório.",
};

const CasesPage = () => {
  return (
    <Suspense fallback={<CasesSkeleton />}>
      <CasesData />
    </Suspense>
  );
};

export default CasesPage;
