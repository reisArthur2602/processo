"use client";

import { FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export interface IntakeReportData {
  number: string;
  clientName: string;
  clientDocument: string | null;
  clientPhone: string | null;
  clientAddress: string | null;
  clientReport: string | null;
  preliminaryAnalysis: string | null;
  providences: string[];
  otherProvidence: string | null;
  feeAmount: number | null;
  amountReceived: number | null;
  paymentMethod: string | null;
  paymentNotes: string | null;
}

interface GenerateIntakeReportButtonProps {
  data: IntakeReportData;
}

const PROVIDENCE_LABELS: Record<string, string> = {
  REQUEST_DOCUMENTS: "Solicitar documentos",
  PREPARE_LEGAL_OPINION: "Elaborar parecer jurídico",
  SCHEDULE_RETURN: "Agendar retorno",
  PREPARE_CONTRACT: "Elaborar contrato",
  FILE_LAWSUIT: "Ajuizar ação",
  SETTLEMENT_ATTEMPT: "Tentativa de acordo",
  OTHER: "Outro",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CASH: "Dinheiro",
  PIX: "Pix",
  BANK_TRANSFER: "Transferência bancária",
  CREDIT_CARD: "Cartão de crédito",
  DEBIT_CARD: "Cartão de débito",
  BOLETO: "Boleto",
  INSTALLMENTS: "Parcelado",
  OTHER: "Outro",
};

const isIntakeEmpty = (data: IntakeReportData) =>
  !data.clientReport &&
  !data.preliminaryAnalysis &&
  data.providences.length === 0 &&
  !data.otherProvidence &&
  data.feeAmount === null &&
  data.amountReceived === null &&
  !data.paymentMethod &&
  !data.paymentNotes;

const fmtCurrency = (value: number | null) =>
  value !== null
    ? value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : null;

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 20;
const CONTENT_W = PAGE_W - MARGIN * 2;
const BOTTOM = PAGE_H - MARGIN - 8;

const buildPdf = async (data: IntakeReportData) => {
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
    pdf.text(`Ficha de Atendimento nº ${data.number}`, PAGE_W - MARGIN, y, {
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

  const paragraph = (text: string) => {
    pdf.setFont("times", "normal");
    pdf.setFontSize(10);
    const lines: string[] = pdf.splitTextToSize(text.trim(), CONTENT_W);
    const lineHeight = 5.4;
    for (const line of lines) {
      ensureSpace(lineHeight);
      pdf.text(line, MARGIN, y);
      y += lineHeight;
    }
    y += 4;
  };

  drawHeader();

  // Dados do cliente
  sectionTitle("Dados do cliente");
  wrappedKeyValue("Nome", data.clientName);
  if (data.clientDocument && data.clientPhone) {
    keyValueRow2("Documento", data.clientDocument, "Telefone", data.clientPhone);
  } else if (data.clientDocument) {
    keyValueRow("Documento", data.clientDocument);
  } else if (data.clientPhone) {
    keyValueRow("Telefone", data.clientPhone);
  }
  if (data.clientAddress) wrappedKeyValue("Endereço", data.clientAddress);
  y += 3;

  // Relato do cliente
  if (data.clientReport?.trim()) {
    sectionTitle("Relato do cliente");
    paragraph(data.clientReport);
  }

  // Análise preliminar
  if (data.preliminaryAnalysis?.trim()) {
    sectionTitle("Análise preliminar");
    paragraph(data.preliminaryAnalysis);
  }

  // Providências
  if (data.providences.length > 0 || data.otherProvidence?.trim()) {
    sectionTitle("Providências");
    pdf.setFont("times", "normal");
    pdf.setFontSize(10);
    for (const p of data.providences) {
      ensureSpace(5.6);
      pdf.text(`•  ${PROVIDENCE_LABELS[p] ?? p}`, MARGIN, y);
      y += 5.6;
    }
    if (data.otherProvidence?.trim()) {
      y += 1;
      paragraph(data.otherProvidence);
    } else {
      y += 3;
    }
  }

  // Honorários e pagamento
  const feeAmount = fmtCurrency(data.feeAmount);
  const amountReceived = fmtCurrency(data.amountReceived);
  const paymentMethodLabel = data.paymentMethod
    ? (PAYMENT_METHOD_LABELS[data.paymentMethod] ?? data.paymentMethod)
    : null;
  const hasFinancial =
    feeAmount ||
    amountReceived ||
    paymentMethodLabel ||
    data.paymentNotes?.trim();

  if (hasFinancial) {
    sectionTitle("Honorários e pagamento");
    if (feeAmount) keyValueRow("Honorários", feeAmount);
    if (amountReceived) keyValueRow("Valor recebido", amountReceived);
    if (paymentMethodLabel)
      keyValueRow("Forma de pagamento", paymentMethodLabel);
    if (data.paymentNotes?.trim()) {
      y += 1;
      paragraph(data.paymentNotes);
    } else {
      y += 3;
    }
  }

  // Assinaturas
  ensureSpace(34);
  y += 10;
  const colW = (CONTENT_W - 14) / 2;
  const col1X = MARGIN;
  const col2X = MARGIN + colW + 14;
  pdf.setDrawColor(0);
  pdf.setLineWidth(0.3);
  pdf.line(col1X, y, col1X + colW, y);
  pdf.line(col2X, y, col2X + colW, y);
  y += 4.5;
  pdf.setFont("times", "normal");
  pdf.setFontSize(9);
  pdf.text("Assinatura do cliente", col1X + colW / 2, y, { align: "center" });
  pdf.text("Responsável pelo atendimento", col2X + colW / 2, y, {
    align: "center",
  });

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
    pdf.text(`Ficha ${data.number} — ${data.clientName}`, MARGIN, footerY);
    pdf.text(`Página ${i} de ${totalPages}`, PAGE_W - MARGIN, footerY, {
      align: "right",
    });
  }

  pdf.save(`ficha-${data.number}.pdf`);
};

const GenerateIntakeReportButton = ({
  data,
}: GenerateIntakeReportButtonProps) => {
  const [generating, setGenerating] = useState(false);
  const empty = isIntakeEmpty(data);

  const handleGenerate = async () => {
    if (empty) return;
    setGenerating(true);
    try {
      await buildPdf(data);
    } catch {
      toast.error("Não foi possível gerar a ficha em PDF.");
    } finally {
      setGenerating(false);
    }
  };

  return (
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
  );
};

export { GenerateIntakeReportButton };
