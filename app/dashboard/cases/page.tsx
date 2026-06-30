import { Suspense } from "react";
import { CasesData } from "./feature/cases-data";
import { CasesSkeleton } from "./feature/cases-skeleton";

const CasesPage = () => {
  return (
    <Suspense fallback={<CasesSkeleton />}>
      <CasesData />
    </Suspense>
  );
};

export default CasesPage;
