"use client";

import { FileText } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  type IntakeReportData,
  IntakeReportTemplate,
} from "./intake-report-template";

interface GenerateIntakeReportButtonProps {
  data: IntakeReportData;
}

const isIntakeEmpty = (data: IntakeReportData) =>
  !data.clientReport &&
  !data.preliminaryAnalysis &&
  data.providences.length === 0 &&
  !data.otherProvidence &&
  data.feeAmount === null &&
  data.amountReceived === null &&
  !data.paymentMethod &&
  !data.paymentNotes;

const GenerateIntakeReportButton = ({
  data,
}: GenerateIntakeReportButtonProps) => {
  const [generating, setGenerating] = useState(false);
  const templateRef = useRef<HTMLDivElement>(null);
  const empty = isIntakeEmpty(data);

  const handleGenerate = async () => {
    if (!templateRef.current || empty) return;
    setGenerating(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(templateRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        windowWidth: templateRef.current.scrollWidth,
        windowHeight: templateRef.current.scrollHeight,
      });

      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        pageWidth,
        pageHeight,
      );
      pdf.save(`ficha-${data.number}.pdf`);
    } catch {
      toast.error("Não foi possível gerar a ficha em PDF.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        onClick={handleGenerate}
        loading={generating}
        disabled={empty}
        title={empty ? "Preencha a ficha antes de gerar o PDF." : undefined}
      >
        <FileText className="h-4 w-4" />
        Gerar ficha
      </Button>

      <div className="pointer-events-none fixed left-[-9999px] top-0 overflow-hidden">
        <IntakeReportTemplate ref={templateRef} {...data} />
      </div>
    </>
  );
};

export { GenerateIntakeReportButton };
