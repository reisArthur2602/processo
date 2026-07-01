import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session";
import prisma from "@/lib/prisma";

type CaseWithRelations = Awaited<ReturnType<typeof fetchCase>>;

const fetchCase = (caseId: string) =>
  prisma.case.findUnique({
    where: { id: caseId },
    include: {
      parties: true,
      movements: {
        orderBy: { occurredAt: "asc" },
        include: { createdBy: { select: { name: true } } },
      },
      deadlines: {
        where: { status: "PENDING" },
        orderBy: { dueAt: "asc" },
      },
    },
  });

const fmt = (date: Date | string) =>
  new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const fmtShort = (date: Date | string) =>
  new Date(date).toLocaleDateString("pt-BR");

const statusLabel = (s: string) =>
  ({ ACTIVE: "Ativo", SUSPENDED: "Suspenso", ARCHIVED: "Arquivado" })[s] ?? s;

const generateHtml = (
  caseData: NonNullable<CaseWithRelations>,
  userName: string,
): string => {
  const plaintiff = caseData.parties.find((p) => p.partyType === "PLAINTIFF");
  const defendant = caseData.parties.find((p) => p.partyType === "DEFENDANT");

  const claimValue = caseData.claimValue
    ? Number(caseData.claimValue).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    : null;

  const movementsHtml = caseData.movements
    .map(
      (m) => `
      <tr>
        <td>${fmtShort(m.occurredAt)}</td>
        <td>${m.movementType}</td>
        <td><strong>${m.title}</strong>${m.description ? `<br/><span class="desc">${m.description}</span>` : ""}</td>
        <td>${m.createdBy.name}</td>
      </tr>`,
    )
    .join("");

  const deadlinesHtml = caseData.deadlines
    .map(
      (d) => `
      <tr>
        <td>${fmtShort(d.dueAt)}</td>
        <td>${d.title}</td>
        <td>${d.description ?? "—"}</td>
      </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Relatório — ${caseData.number}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      font-size: 11pt;
      color: #0b1f33;
      background: #fff;
      padding: 40px 48px;
      max-width: 860px;
      margin: 0 auto;
    }

    @page { size: A4; margin: 2.5cm; }

    @media print {
      body { padding: 0; max-width: none; }
      .no-print { display: none !important; }
      table { page-break-inside: avoid; }
      h2 { page-break-after: avoid; }
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #b58b4a;
      padding-bottom: 16px;
      margin-bottom: 28px;
    }

    header .firm { font-size: 14pt; font-weight: bold; color: #0b1f33; }
    header .meta { font-size: 9pt; color: #516272; text-align: right; line-height: 1.7; }

    .case-number {
      font-family: 'Courier New', monospace;
      font-size: 9pt;
      font-weight: bold;
      color: #123a5a;
      letter-spacing: 0.05em;
      background: #eaf1f6;
      padding: 3px 8px;
      border-radius: 4px;
      display: inline-block;
      margin-bottom: 8px;
    }

    h1 { font-size: 20pt; font-weight: bold; margin-bottom: 4px; line-height: 1.2; }
    h2 {
      font-size: 10pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #123a5a;
      margin: 28px 0 10px;
      padding-bottom: 6px;
      border-bottom: 1px solid #d8e1e8;
    }

    .status-badge {
      display: inline-block;
      font-size: 8pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: 3px 10px;
      border-radius: 20px;
      margin-bottom: 12px;
    }
    .status-ACTIVE { background: #e8f6f1; color: #147d64; }
    .status-SUSPENDED { background: #fff5e4; color: #a66b1f; }
    .status-ARCHIVED { background: #f4f7f9; color: #516272; }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

    .field { margin-bottom: 12px; }
    .field .label {
      font-size: 8pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #516272;
      margin-bottom: 3px;
    }
    .field .value { font-size: 11pt; }
    .field .value.mono {
      font-family: 'Courier New', monospace;
      font-size: 10pt;
    }
    .field .value.large {
      font-size: 15pt;
      font-weight: bold;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10pt;
    }
    th {
      text-align: left;
      padding: 6px 8px;
      font-size: 8pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #516272;
      border-bottom: 1px solid #d8e1e8;
      background: #f4f7f9;
    }
    td {
      padding: 8px 8px;
      border-bottom: 1px solid #eaf1f6;
      vertical-align: top;
      line-height: 1.5;
    }
    tr:last-child td { border-bottom: none; }
    .desc { font-size: 9pt; color: #516272; margin-top: 3px; display: block; }

    .empty { color: #516272; font-size: 10pt; font-style: italic; padding: 12px 0; }

    footer {
      margin-top: 40px;
      padding-top: 12px;
      border-top: 1px solid #d8e1e8;
      font-size: 8pt;
      color: #516272;
      display: flex;
      justify-content: space-between;
    }

    .print-btn {
      display: block;
      margin: 32px auto 0;
      padding: 10px 28px;
      background: #123a5a;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      font-family: sans-serif;
    }
    .print-btn:hover { background: #0b1f33; }
  </style>
</head>
<body>

  <header>
    <div>
      <div class="firm">Sistema Jurídico</div>
      <div style="font-size:9pt;color:#516272;margin-top:4px;">Gestão de processos</div>
    </div>
    <div class="meta">
      Relatório gerado em ${fmt(new Date())}<br/>
      Por: ${userName}<br/>
      Documento confidencial
    </div>
  </header>

  <div class="case-number">${caseData.number}</div>
  <span class="status-badge status-${caseData.status}">${statusLabel(caseData.status)}</span>
  <h1>${caseData.actionType}</h1>
  ${plaintiff && defendant ? `<p style="margin-top:6px;color:#516272;font-size:10pt;">${plaintiff.name} contra ${defendant.name}</p>` : ""}

  <h2>Partes</h2>
  <div class="grid-2">
    <div>
      <div class="field">
        <div class="label">Autor</div>
        <div class="value">${plaintiff?.name ?? "—"}</div>
        ${plaintiff?.document ? `<div style="font-size:9pt;color:#516272;">${plaintiff.document}</div>` : ""}
      </div>
    </div>
    <div>
      <div class="field">
        <div class="label">Réu</div>
        <div class="value">${defendant?.name ?? "—"}</div>
        ${defendant?.document ? `<div style="font-size:9pt;color:#516272;">${defendant.document}</div>` : ""}
      </div>
    </div>
  </div>

  <h2>Dados do processo</h2>
  <div class="grid-3">
    <div class="field">
      <div class="label">Tribunal</div>
      <div class="value">${caseData.court}</div>
      ${caseData.division ? `<div style="font-size:9pt;color:#516272;">${caseData.division}</div>` : ""}
    </div>
    ${
      claimValue
        ? `<div class="field">
          <div class="label">Valor da causa</div>
          <div class="value large">${claimValue}</div>
        </div>`
        : ""
    }
    <div class="field">
      <div class="label">Status</div>
      <div class="value">${statusLabel(caseData.status)}</div>
    </div>
  </div>

  <h2>Linha do tempo (${caseData.movements.length} movimentações)</h2>
  ${
    caseData.movements.length > 0
      ? `<table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipo</th>
            <th>Movimentação</th>
            <th>Registrado por</th>
          </tr>
        </thead>
        <tbody>${movementsHtml}</tbody>
      </table>`
      : '<p class="empty">Nenhuma movimentação registrada.</p>'
  }

  <h2>Prazos pendentes (${caseData.deadlines.length})</h2>
  ${
    caseData.deadlines.length > 0
      ? `<table>
        <thead>
          <tr>
            <th>Vencimento</th>
            <th>Prazo</th>
            <th>Observações</th>
          </tr>
        </thead>
        <tbody>${deadlinesHtml}</tbody>
      </table>`
      : '<p class="empty">Nenhum prazo pendente.</p>'
  }

  <footer>
    <span>Processo ${caseData.number} — ${caseData.actionType}</span>
    <span>Gerado em ${fmt(new Date())} · Documento confidencial</span>
  </footer>

  <button class="no-print print-btn" onclick="window.print()">
    Imprimir / Salvar como PDF
  </button>

  <script>
    window.addEventListener('load', () => setTimeout(() => window.print(), 600));
  </script>

</body>
</html>`;
};

export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ case_id: string }> },
) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL("/auth", _req.url));
  }

  const { case_id } = await params;
  const caseData = await fetchCase(case_id);

  if (!caseData) {
    return NextResponse.json(
      { error: "Processo não encontrado." },
      { status: 404 },
    );
  }

  const html = generateHtml(caseData, session.name);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
};
