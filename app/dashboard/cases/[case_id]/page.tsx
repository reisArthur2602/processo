import { Suspense } from "react";
import { CaseDetailData } from "./feature/case-detail-data";
import { CaseDetailSkeleton } from "./feature/case-detail-skeleton";

interface Props {
  params: Promise<{ case_id: string }>;
}

const CaseDetailPage = async ({ params }: Props) => {
  const { case_id } = await params;

  return (
    <Suspense fallback={<CaseDetailSkeleton />}>
      <CaseDetailData caseId={case_id} />
    </Suspense>
  );
};

export default CaseDetailPage;
