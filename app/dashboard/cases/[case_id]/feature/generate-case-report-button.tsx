"use client";

import { FileText } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  type CaseReportData,
  CaseReportTemplate,
} from "./case-report-template";

interface GenerateCaseReportButtonProps {
  data: CaseReportData;
}

const GenerateCaseReportButton = ({ data }: GenerateCaseReportButtonProps) => {
  const [generating, setGenerating] = useState(false);
  const templateRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!templateRef.current) return;
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
      pdf.save(`relatorio-${data.number}.pdf`);
    } catch {
      toast.error("Não foi possível gerar o relatório em PDF.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <Button variant="secondary" onClick={handleGenerate} loading={generating}>
        <FileText className="h-4 w-4" />
        Gerar relatório PDF
      </Button>

      <div className="pointer-events-none fixed left-[-9999px] top-0 overflow-hidden">
        <CaseReportTemplate ref={templateRef} {...data} />
      </div>
    </>
  );
};

export { GenerateCaseReportButton };
