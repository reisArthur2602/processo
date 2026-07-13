import { Fragment, forwardRef } from "react";

export interface IntakeReportData {
  number: string;
  serviceArea: string;
  attendedAt: string;
  responsibleName: string;
  clientName: string;
  clientDocument: string | null;
  clientPhone: string | null;
  clientReport: string | null;
  preliminaryAnalysis: string | null;
  providences: string[];
  otherProvidence: string | null;
  feeAmount: number | null;
  amountReceived: number | null;
  paymentMethod: string | null;
  paymentNotes: string | null;
  generatedByName: string;
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

const MAX_ANALYSIS_WORDS = 60;

const truncateWords = (text: string, maxWords: number) => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text.trim();
  return `${words.slice(0, maxWords).join(" ")}…`;
};

const fmtDateTime = (iso: string) => {
  const date = new Date(iso);
  const time = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date.toLocaleDateString("pt-BR")} às ${time}`;
};

const fmtCurrency = (value: number | null) =>
  value !== null
    ? value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : null;

const InfoRow = ({
  cells,
}: {
  cells: { label: string; value: string; colSpan?: number }[];
}) => (
  <tr>
    {cells.map((cell) => (
      <Fragment key={cell.label}>
        <td className="w-36 border border-line bg-mist px-3 py-2 text-xs font-bold text-slate">
          {cell.label}
        </td>
        <td
          colSpan={cell.colSpan}
          className="border border-line px-3 py-2 text-sm text-ink"
        >
          {cell.value}
        </td>
      </Fragment>
    ))}
  </tr>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-6 text-xs font-bold uppercase tracking-widest text-navy">
    {children}
  </p>
);

const RuledBox = ({
  children,
  minLines = 3,
}: {
  children: React.ReactNode;
  minLines?: number;
}) => (
  <div
    className="mt-2 whitespace-pre-wrap wrap-break-word text-sm leading-7 text-ink"
    style={{ minHeight: minLines * 28 }}
  >
    {children}
  </div>
);

const IntakeReportTemplate = forwardRef<HTMLDivElement, IntakeReportData>(
  (data, ref) => {
    const feeAmount = fmtCurrency(data.feeAmount);
    const amountReceived = fmtCurrency(data.amountReceived);

    const providencesLabel = data.providences.length
      ? data.providences.map((p) => PROVIDENCE_LABELS[p] ?? p).join(", ") +
        (data.otherProvidence ? ` — ${data.otherProvidence}` : "")
      : "Nenhuma providência registrada.";

    const hasFinancial =
      feeAmount || amountReceived || data.paymentMethod || data.paymentNotes;

    return (
      <div
        ref={ref}
        className="h-fit w-[794px] bg-white p-10 font-serif text-ink"
      >
        {/* Header */}
        <div className="flex h-fit items-start justify-between border-b-2 border-docket pb-3">
          <div>
            <p className="text-lg font-bold">Sistema Jurídico</p>
            <p className="text-xs text-slate">Gestão de processos</p>
          </div>
          <div className="text-right text-xs leading-5 text-slate">
            <p>Ficha de Atendimento</p>
            <p>Nº {data.number}</p>
            <p>Documento confidencial</p>
          </div>
        </div>

        <h1 className="mt-5 text-center text-2xl font-bold uppercase tracking-[0.06em]">
          Ficha de Atendimento
        </h1>

        {/* Info table */}
        <table className="mt-6 w-full h-fit border-collapse">
          <tbody>
            <InfoRow
              cells={[{ label: "Cliente", value: data.clientName, colSpan: 3 }]}
            />
            <InfoRow
              cells={[
                { label: "Documento", value: data.clientDocument ?? "—" },
                { label: "Telefone", value: data.clientPhone ?? "—" },
              ]}
            />
            <InfoRow
              cells={[
                { label: "Data / Hora", value: fmtDateTime(data.attendedAt) },
                { label: "Área", value: data.serviceArea },
              ]}
            />
            <InfoRow
              cells={[
                {
                  label: "Advogado(a)",
                  value: data.responsibleName,
                  colSpan: 3,
                },
              ]}
            />
          </tbody>
        </table>

        {/* Relato do cliente */}
        <SectionTitle>Relato do cliente</SectionTitle>
        <RuledBox>
          {data.clientReport
            ? truncateWords(data.clientReport, MAX_ANALYSIS_WORDS)
            : "Não informado."}
        </RuledBox>

        {/* Análise preliminar */}
        <SectionTitle>Análise preliminar</SectionTitle>
        <RuledBox>
          {data.preliminaryAnalysis
            ? truncateWords(data.preliminaryAnalysis, MAX_ANALYSIS_WORDS)
            : "Não informado."}
        </RuledBox>

        {/* Providências */}
        <SectionTitle>Providências</SectionTitle>
        <RuledBox minLines={2}>{providencesLabel}</RuledBox>

        {/* Honorários */}
        <SectionTitle>Honorários</SectionTitle>
        <RuledBox minLines={2}>
          {hasFinancial ? (
            <>
              {feeAmount && (
                <p>
                  Honorários: <strong>{feeAmount}</strong>
                </p>
              )}
              {amountReceived && (
                <p>
                  Valor recebido: <strong>{amountReceived}</strong>
                </p>
              )}
              {data.paymentMethod && (
                <p>
                  Forma de pagamento:{" "}
                  {PAYMENT_METHOD_LABELS[data.paymentMethod] ??
                    data.paymentMethod}
                </p>
              )}
              {data.paymentNotes && <p>{data.paymentNotes}</p>}
            </>
          ) : (
            "Nenhuma informação financeira registrada."
          )}
        </RuledBox>

        {/* Signatures */}
        <div className="mt-16 grid h-fit grid-cols-2 gap-10 text-center">
          <div>
            <div className="h-14" />
            <div className="border-t border-ink pt-2 text-sm">
              Assinatura do cliente
            </div>
          </div>
          <div>
            <div className="h-14" />
            <div className="border-t border-ink pt-2 text-sm">
              Assinatura do responsável pelo atendimento
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex h-fit justify-between border-t border-line pt-2 text-[10px] text-slate">
          <span>
            Ficha {data.number} — {data.clientName}
          </span>
          <span>
            Gerado em {fmtDateTime(new Date().toISOString())} por{" "}
            {data.generatedByName} · Documento confidencial
          </span>
        </div>
      </div>
    );
  },
);

IntakeReportTemplate.displayName = "IntakeReportTemplate";

export { IntakeReportTemplate };
