import { Fragment, forwardRef } from "react";

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
  generatedByName: string;
}

const STATUS_LABELS: Record<CaseReportData["status"], string> = {
  ACTIVE: "Ativo",
  SUSPENDED: "Suspenso",
  ARCHIVED: "Arquivado",
};

const STATUS_CLASSES: Record<CaseReportData["status"], string> = {
  ACTIVE: "bg-success-soft text-success",
  SUSPENDED: "bg-warning-soft text-warning",
  ARCHIVED: "bg-mist text-slate",
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const fmtShort = (iso: string) => new Date(iso).toLocaleDateString("pt-BR");

const InfoRow = ({
  cells,
}: {
  cells: {
    label: string;
    value: string;
    sub?: string | null;
    colSpan?: number;
  }[];
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
          {cell.sub && (
            <span className="ml-2 text-xs text-slate">{cell.sub}</span>
          )}
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

const CaseReportTemplate = forwardRef<HTMLDivElement, CaseReportData>(
  (data, ref) => {
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
            <p>Relatório gerado em {fmt(new Date().toISOString())}</p>
            <p>Por: {data.generatedByName}</p>
            <p>Documento confidencial</p>
          </div>
        </div>

        <div className="mt-5 flex h-fit items-center gap-3">
          <span className="rounded bg-navy-soft px-2.5 py-1 font-mono text-xs font-bold tracking-wide text-navy">
            {data.number}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${STATUS_CLASSES[data.status]}`}
          >
            {STATUS_LABELS[data.status]}
          </span>
        </div>
        <h1 className="mt-2 text-2xl font-bold">{data.actionType}</h1>
        {data.plaintiffName && data.defendantName && (
          <p className="mt-1 text-sm text-slate">
            {data.plaintiffName} contra {data.defendantName}
          </p>
        )}

        {/* Partes */}
        <SectionTitle>Partes</SectionTitle>
        <table className="mt-2 w-full h-fit border-collapse">
          <tbody>
            <InfoRow
              cells={[
                {
                  label: "Autor",
                  value: data.plaintiffName ?? "—",
                  sub: data.plaintiffDocument,
                },
              ]}
            />
            <InfoRow
              cells={[
                {
                  label: "Réu",
                  value: data.defendantName ?? "—",
                  sub: data.defendantDocument,
                },
              ]}
            />
          </tbody>
        </table>

        {/* Dados do processo */}
        <SectionTitle>Dados do processo</SectionTitle>
        <table className="mt-2 w-full h-fit border-collapse">
          <tbody>
            <InfoRow
              cells={[
                { label: "Tribunal", value: data.court, sub: data.division },
              ]}
            />
            {data.claimValue && (
              <InfoRow
                cells={[{ label: "Valor da causa", value: data.claimValue }]}
              />
            )}
            <InfoRow
              cells={[{ label: "Status", value: STATUS_LABELS[data.status] }]}
            />
          </tbody>
        </table>

        {/* Linha do tempo */}
        <SectionTitle>
          Linha do tempo ({data.movements.length} movimentações)
        </SectionTitle>
        {data.movements.length > 0 ? (
          <table className="mt-2 w-full h-fit border-collapse text-sm">
            <thead>
              <tr className="bg-mist">
                <th className="border-b border-line px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wide text-slate">
                  Data
                </th>
                <th className="border-b border-line px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wide text-slate">
                  Tipo
                </th>
                <th className="border-b border-line px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wide text-slate">
                  Movimentação
                </th>
                <th className="border-b border-line px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wide text-slate">
                  Registrado por
                </th>
              </tr>
            </thead>
            <tbody>
              {data.movements.map((m) => (
                <tr key={m.id}>
                  <td className="border-b border-line px-3 py-2.5 align-top">
                    {fmtShort(m.occurredAt)}
                  </td>
                  <td className="border-b border-line px-3 py-2.5 align-top">
                    {m.movementType}
                  </td>
                  <td className="border-b border-line px-3 py-2.5 align-top">
                    <p className="font-semibold">{m.title}</p>
                    {m.description && (
                      <p className="mt-1 text-xs text-slate">{m.description}</p>
                    )}
                  </td>
                  <td className="border-b border-line px-3 py-2.5 align-top">
                    {m.createdByName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-2 text-sm italic text-slate">
            Nenhuma movimentação registrada.
          </p>
        )}

        {/* Prazos pendentes */}
        <SectionTitle>Prazos pendentes ({data.deadlines.length})</SectionTitle>
        {data.deadlines.length > 0 ? (
          <table className="mt-2 w-full h-fit border-collapse text-sm">
            <thead>
              <tr className="bg-mist">
                <th className="border-b border-line px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wide text-slate">
                  Vencimento
                </th>
                <th className="border-b border-line px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wide text-slate">
                  Prazo
                </th>
                <th className="border-b border-line px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wide text-slate">
                  Observações
                </th>
              </tr>
            </thead>
            <tbody>
              {data.deadlines.map((d) => (
                <tr key={d.id}>
                  <td className="border-b border-line px-3 py-2.5 align-top">
                    {fmtShort(d.dueAt)}
                  </td>
                  <td className="border-b border-line px-3 py-2.5 align-top">
                    {d.title}
                  </td>
                  <td className="border-b border-line px-3 py-2.5 align-top">
                    {d.description ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-2 text-sm italic text-slate">
            Nenhum prazo pendente.
          </p>
        )}

        {/* Footer */}
        <div className="mt-8 flex h-fit justify-between border-t border-line pt-2 text-[10px] text-slate">
          <span>
            Processo {data.number} — {data.actionType}
          </span>
          <span>
            Gerado em {fmt(new Date().toISOString())} · Documento confidencial
          </span>
        </div>
      </div>
    );
  },
);

CaseReportTemplate.displayName = "CaseReportTemplate";

export { CaseReportTemplate };
