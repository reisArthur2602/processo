"use client";

import { FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export interface CaseReportMovement {
  id: string;
  title: string;
  movementType: string;
  description: string | null;
  occurredAt: string;
  createdByName: string;
}

export interface CaseReportDeadline {
  id: string;
  title: string;
  description: string | null;
  dueAt: string;
}

export interface CaseReportData {
  number: string;
  actionType: string;
  status: "ACTIVE" | "SUSPENDED" | "ARCHIVED";
  court: string;
  division: string | null;
  claimValue: string | null;
  plaintiffName: string | null;
  plaintiffDocument: string | null;
  defendantName: string | null;
  defendantDocument: string | null;
  movements: CaseReportMovement[];
  deadlines: CaseReportDeadline[];
}

interface GenerateCaseReportButtonProps {
  data: CaseReportData;
}

const STATUS_LABELS: Record<CaseReportData["status"], string> = {
  ACTIVE: "Ativo",
  SUSPENDED: "Suspenso",
  ARCHIVED: "Arquivado",
};

const fmtShort = (iso: string) => new Date(iso).toLocaleDateString("pt-BR");

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 20;
const CONTENT_W = PAGE_W - MARGIN * 2;
const BOTTOM = PAGE_H - MARGIN - 8;

const buildPdf = async (data: CaseReportData) => {
  const { default: jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ unit: "mm", format: "a4" });

  let y = MARGIN;

  const drawHeader = () => {
    pdf.setFont("times", "bold");
    pdf.setFontSize(13);
    pdf.setTextColor(0);
    pdf.text("MONTEIRO", MARGIN, y);

    pdf.setFont("times", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(90);
    pdf.text("SOCIEDADE DE ADVOGADOS", MARGIN, y + 4.5);

    pdf.setFont("times", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(0);
    pdf.text(`Relatório do Processo ${data.number}`, PAGE_W - MARGIN, y, {
      align: "right",
    });
    pdf.setFontSize(8);
    pdf.setTextColor(90);
    pdf.text("Documento confidencial", PAGE_W - MARGIN, y + 4.5, {
      align: "right",
    });
    pdf.setTextColor(0);

    y += 10;
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.4);
    pdf.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 9;
  };

  const newPage = () => {
    pdf.addPage();
    y = MARGIN;
    drawHeader();
  };

  const ensureSpace = (height: number) => {
    if (y + height > BOTTOM) newPage();
  };

  const sectionTitle = (title: string) => {
    ensureSpace(11);
    pdf.setFont("times", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(0);
    pdf.text(title.toUpperCase(), MARGIN, y);
    y += 1.8;
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.2);
    pdf.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 6.5;
  };

  const keyValueRow = (label: string, value: string) => {
    ensureSpace(6);
    pdf.setFont("times", "bold");
    pdf.setFontSize(9);
    pdf.text(`${label}:`, MARGIN, y);
    pdf.setFont("times", "normal");
    pdf.text(value, MARGIN + 42, y);
    y += 6;
  };

  const COL2_X = MARGIN + CONTENT_W / 2 + 4;

  const keyValueRow2 = (
    labelA: string,
    valueA: string,
    labelB?: string,
    valueB?: string,
  ) => {
    ensureSpace(6);
    pdf.setFont("times", "bold");
    pdf.setFontSize(9);
    pdf.text(`${labelA}:`, MARGIN, y);
    const widthA = pdf.getTextWidth(`${labelA}: `);
    pdf.setFont("times", "normal");
    pdf.text(valueA, MARGIN + widthA, y);

    if (labelB && valueB) {
      pdf.setFont("times", "bold");
      pdf.text(`${labelB}:`, COL2_X, y);
      const widthB = pdf.getTextWidth(`${labelB}: `);
      pdf.setFont("times", "normal");
      pdf.text(valueB, COL2_X + widthB, y);
    }
    y += 6;
  };

  const wrappedKeyValue = (label: string, value: string) => {
    pdf.setFont("times", "bold");
    pdf.setFontSize(9);
    const labelWidth = pdf.getTextWidth(`${label}: `);
    pdf.setFont("times", "normal");
    const lines: string[] = pdf.splitTextToSize(
      value,
      CONTENT_W - labelWidth,
    );

    ensureSpace(6);
    pdf.setFont("times", "bold");
    pdf.text(`${label}:`, MARGIN, y);
    pdf.setFont("times", "normal");
    pdf.text(lines[0], MARGIN + labelWidth, y);
    y += 6;

    for (let i = 1; i < lines.length; i++) {
      ensureSpace(5.4);
      pdf.text(lines[i], MARGIN + labelWidth, y);
      y += 5.4;
    }
  };

  const paragraph = (text: string, size = 10) => {
    pdf.setFont("times", "normal");
    pdf.setFontSize(size);
    const lines: string[] = pdf.splitTextToSize(text.trim(), CONTENT_W);
    const lineHeight = size >= 10 ? 5.4 : 4.8;
    for (const line of lines) {
      ensureSpace(lineHeight);
      pdf.text(line, MARGIN, y);
      y += lineHeight;
    }
  };

  drawHeader();

  // Partes
  const hasParties = data.plaintiffName || data.defendantName;
  if (hasParties) {
    sectionTitle("Partes");
    if (data.plaintiffName) wrappedKeyValue("Autor", data.plaintiffName);
    if (data.plaintiffDocument)
      keyValueRow("Documento do autor", data.plaintiffDocument);
    if (data.defendantName) wrappedKeyValue("Réu", data.defendantName);
    if (data.defendantDocument)
      keyValueRow("Documento do réu", data.defendantDocument);
    y += 3;
  }

  // Dados do processo
  sectionTitle("Dados do processo");
  keyValueRow("Tipo de ação", data.actionType);
  if (data.division) {
    keyValueRow2("Tribunal", data.court, "Vara", data.division);
  } else {
    keyValueRow("Tribunal", data.court);
  }
  if (data.claimValue) {
    keyValueRow2(
      "Valor da causa",
      data.claimValue,
      "Status",
      STATUS_LABELS[data.status],
    );
  } else {
    keyValueRow("Status", STATUS_LABELS[data.status]);
  }
  y += 3;

  // Linha do tempo
  if (data.movements.length > 0) {
    sectionTitle(`Linha do tempo (${data.movements.length})`);
    for (const m of data.movements) {
      ensureSpace(11);
      pdf.setFont("times", "bold");
      pdf.setFontSize(9);
      pdf.text(`${fmtShort(m.occurredAt)} · ${m.movementType}`, MARGIN, y);
      y += 5;
      pdf.setFont("times", "normal");
      pdf.setFontSize(10);
      const titleLines: string[] = pdf.splitTextToSize(m.title, CONTENT_W);
      for (const line of titleLines) {
        ensureSpace(5.4);
        pdf.text(line, MARGIN, y);
        y += 5.4;
      }
      if (m.description?.trim()) {
        paragraph(m.description, 9);
      }
      pdf.setFont("times", "italic");
      pdf.setFontSize(8);
      pdf.setTextColor(120);
      ensureSpace(5);
      pdf.text(`Registrado por ${m.createdByName}`, MARGIN, y);
      pdf.setTextColor(0);
      y += 7;
    }
  }

  // Prazos pendentes
  if (data.deadlines.length > 0) {
    sectionTitle(`Prazos pendentes (${data.deadlines.length})`);
    for (const d of data.deadlines) {
      ensureSpace(11);
      pdf.setFont("times", "bold");
      pdf.setFontSize(9);
      pdf.text(`Vencimento: ${fmtShort(d.dueAt)}`, MARGIN, y);
      y += 5;
      pdf.setFont("times", "normal");
      pdf.setFontSize(10);
      const titleLines: string[] = pdf.splitTextToSize(d.title, CONTENT_W);
      for (const line of titleLines) {
        ensureSpace(5.4);
        pdf.text(line, MARGIN, y);
        y += 5.4;
      }
      if (d.description?.trim()) {
        paragraph(d.description, 9);
      }
      y += 3;
    }
  }

  // Footer em todas as páginas
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    const footerY = PAGE_H - MARGIN + 3;
    pdf.setDrawColor(200);
    pdf.setLineWidth(0.2);
    pdf.line(MARGIN, footerY - 4, PAGE_W - MARGIN, footerY - 4);
    pdf.setFont("times", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(120);
    pdf.text(`Processo ${data.number} — ${data.actionType}`, MARGIN, footerY);
    pdf.text(`Página ${i} de ${totalPages}`, PAGE_W - MARGIN, footerY, {
      align: "right",
    });
  }

  pdf.save(`relatorio-${data.number}.pdf`);
};

const GenerateCaseReportButton = ({ data }: GenerateCaseReportButtonProps) => {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await buildPdf(data);
    } catch {
      toast.error("Não foi possível gerar o relatório em PDF.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Button variant="secondary" onClick={handleGenerate} loading={generating}>
      <FileText className="h-4 w-4" />
      Gerar relatório PDF
    </Button>
  );
};

export { GenerateCaseReportButton };
