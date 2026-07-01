import { Search } from "lucide-react";
import { CnjNumber } from "@/components/shared/cnj-number";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { SectionTitle } from "@/components/shared/section-title";
import { StatusBadge } from "@/components/shared/status-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ButtonExamples } from "./feature/button-examples";
import { ControlsExamples } from "./feature/controls-examples";
import { DialogExamples } from "./feature/dialog-examples";
import { FormExamples } from "./feature/form-examples";
import { TabsExamples } from "./feature/tabs-examples";
import { ToastExamples } from "./feature/toast-examples";

const colors = [
  {
    name: "Ink",
    token: "bg-ink",
    hex: "#0B1F33",
    desc: "Texto principal e navegação",
  },
  {
    name: "Navy",
    token: "bg-navy",
    hex: "#123A5A",
    desc: "Ações primárias e foco",
  },
  {
    name: "Navy Soft",
    token: "bg-navy-soft",
    hex: "#EAF1F6",
    desc: "Hover e estados ativos suaves",
  },
  {
    name: "Slate",
    token: "bg-slate",
    hex: "#516272",
    desc: "Texto secundário e metadados",
  },
  {
    name: "Mist",
    token: "bg-mist",
    hex: "#F4F7F9",
    desc: "Fundos e áreas de descanso",
  },
  {
    name: "Line",
    token: "bg-line",
    hex: "#D8E1E8",
    desc: "Divisores e contornos",
  },
  {
    name: "Docket",
    token: "bg-docket",
    hex: "#B58B4A",
    desc: "Ênfase editorial e sequência",
  },
  {
    name: "Success",
    token: "bg-success",
    hex: "#147D64",
    desc: "Ativo, concluído e validado",
  },
  {
    name: "Success Soft",
    token: "bg-success-soft",
    hex: "#E8F6F1",
    desc: "Fundo de estados positivos",
  },
  {
    name: "Danger",
    token: "bg-danger",
    hex: "#B43C47",
    desc: "Erro, risco e ação destrutiva",
  },
  {
    name: "Danger Soft",
    token: "bg-danger-soft",
    hex: "#FCEDEF",
    desc: "Fundo de estados de erro",
  },
  {
    name: "Warning",
    token: "bg-warning",
    hex: "#A66B1F",
    desc: "Suspenso e atenção",
  },
  {
    name: "Warning Soft",
    token: "bg-warning-soft",
    hex: "#FFF5E4",
    desc: "Fundo de estados de alerta",
  },
];

const tableData = [
  {
    cnj: "0008421-33.2025.8.19.0001",
    client: "Marina Duarte",
    type: "Ação de cobrança",
    date: "Hoje, 09:42",
    status: "active" as const,
  },
  {
    cnj: "0019345-17.2024.8.19.0002",
    client: "Construtora Horizonte",
    type: "Indenização por danos",
    date: "Ontem, 16:18",
    status: "suspended" as const,
  },
  {
    cnj: "0041220-09.2026.8.19.0209",
    client: "Carlos Mendes",
    type: "Reclamação trabalhista",
    date: "28 jun., 11:05",
    status: "active" as const,
  },
  {
    cnj: "0002784-91.2022.8.19.0001",
    client: "Juliana Freitas",
    type: "Obrigação de fazer",
    date: "20 jun., 14:30",
    status: "archived" as const,
  },
];

const DesignSystemPage = () => (
  <div className="flex flex-1 flex-col bg-mist">
    {/* Hero */}
    <header className="relative overflow-hidden border-b border-line bg-white">
      <div className="absolute inset-y-0 left-0 w-2 bg-docket" />
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-navy">
          <span className="h-px w-10 bg-docket" />
          Fundamentos visuais
        </p>
        <h1 className="max-w-3xl font-display text-4xl font-bold tracking-[-0.03em] text-ink sm:text-5xl lg:text-6xl">
          Design System — Processo
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-slate sm:text-lg">
          Componentes, tokens e padrões visuais do sistema jurídico. Azul para
          confiança, bronze para o registro formal do processo.
        </p>
      </div>
    </header>

    <main className="mx-auto max-w-7xl space-y-16 px-5 py-14 lg:px-8 lg:py-20">
      {/* 01 · Cores */}
      <section aria-labelledby="colors-title">
        <SectionTitle
          label="01 · Tokens"
          title="Cores do produto"
          description="A paleta reduz fadiga em uso prolongado e reserva cores intensas para decisões e estados."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {colors.map((c) => (
            <article
              key={c.name}
              className="overflow-hidden rounded-card border border-line bg-white shadow-panel"
            >
              <div className={`h-24 ${c.token}`} />
              <div className="p-5">
                <h3 className="font-semibold text-ink">{c.name}</h3>
                <p className="mt-1 font-mono text-xs text-slate">{c.hex}</p>
                <p className="mt-3 text-sm text-slate">{c.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 02 · Tipografia */}
      <section aria-labelledby="type-title">
        <SectionTitle label="02 · Tipografia" title="Hierarquia legível" />
        <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <article className="rounded-card border border-line bg-white p-6 shadow-panel sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">
              Source Serif 4 · Títulos
            </p>
            <p className="mt-5 font-display text-4xl font-bold tracking-[-0.03em] text-ink sm:text-5xl">
              Uma decisão clara começa por uma leitura clara.
            </p>
            <div className="mt-6 space-y-2 border-t border-line pt-5">
              <p className="font-display text-2xl font-bold text-ink">
                Título H2 — Display bold
              </p>
              <p className="text-xl font-semibold text-ink">
                Subtítulo — Inter semibold
              </p>
              <p className="text-base leading-7 text-ink">
                Corpo de texto — Inter regular, ideal para leitura em contextos
                de processo.
              </p>
              <p className="text-sm text-slate">
                Texto pequeno — usado em metadados e datas.
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy">
                Label uppercase — categoria e seção
              </p>
            </div>
          </article>
          <article className="rounded-card border border-line bg-ink p-6 text-white shadow-panel sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
              Inter · Interface
            </p>
            <p className="mt-5 text-lg font-semibold">
              Dados objetivos, ações diretas e mensagens úteis.
            </p>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Fonte de trabalho da aplicação com pesos 400 a 700.
            </p>
            <div className="mt-6 space-y-2">
              <p className="text-sm font-bold text-white/60 uppercase tracking-[0.12em]">
                IBM Plex Mono · Números CNJ
              </p>
              <div className="rounded-control border border-white/15 bg-white/5 p-4">
                <CnjNumber
                  value="0012345-67.2026.8.19.0001"
                  className="text-white"
                />
              </div>
              <p className="font-mono text-sm font-medium text-white/70">
                Metadados e identificadores únicos
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* 03 · Botões */}
      <section aria-labelledby="buttons-title">
        <SectionTitle
          label="03 · Ações"
          title="Botões e estados"
          description="Todas as variantes, tamanhos e estados interativos."
        />
        <ButtonExamples />
      </section>

      {/* 04 · Formulários */}
      <section aria-labelledby="forms-title">
        <SectionTitle
          label="04 · Formulários"
          title="Campos de entrada"
          description="Inputs, textareas e selects com composição Field + Label + Error."
        />
        <FormExamples />
      </section>

      {/* 05 · Controles */}
      <section aria-labelledby="controls-title">
        <SectionTitle
          label="05 · Controles"
          title="Checkbox, Radio e Switch"
          description="Controles de seleção acessíveis com estados normal, selecionado e desabilitado."
        />
        <ControlsExamples />
      </section>

      {/* 06 · Badges */}
      <section aria-labelledby="badges-title">
        <SectionTitle label="06 · Status" title="Badges de processo" />
        <div className="space-y-5">
          <div className="flex flex-wrap gap-3 rounded-card border border-line bg-white p-6 shadow-panel sm:p-8">
            <p className="w-full text-xs font-bold uppercase tracking-[0.12em] text-slate">
              Status de processo (com dot)
            </p>
            <StatusBadge status="active" />
            <StatusBadge status="suspended" />
            <StatusBadge status="archived" />
          </div>
          <div className="flex flex-wrap gap-3 rounded-card border border-line bg-white p-6 shadow-panel sm:p-8">
            <p className="w-full text-xs font-bold uppercase tracking-[0.12em] text-slate">
              Badge component — todas as variantes
            </p>
            <Badge variant="default">Default</Badge>
            <Badge variant="active" dot>
              Ativo
            </Badge>
            <Badge variant="suspended" dot>
              Suspenso
            </Badge>
            <Badge variant="archived" dot>
              Arquivado
            </Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </div>
      </section>

      {/* 07 · Cards */}
      <section aria-labelledby="cards-title">
        <SectionTitle label="07 · Contêineres" title="Estrutura de cards" />
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Card básico */}
          <Card>
            <CardHeader>
              <CardTitle>Card básico</CardTitle>
              <CardDescription>
                Contém header, content e footer como sub-componentes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate">
                Conteúdo do card com informações relevantes para o usuário.
              </p>
            </CardContent>
            <CardFooter className="gap-2">
              <StatusBadge status="active" />
              <span className="text-xs text-slate">Atualizado hoje</span>
            </CardFooter>
          </Card>

          {/* Card de processo */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CnjNumber value="0008421-33.2025.8.19.0001" />
                  <CardTitle className="mt-2">Ação de cobrança</CardTitle>
                </div>
                <StatusBadge status="active" />
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4 text-sm">
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-wide text-slate">
                    Cliente
                  </dt>
                  <dd className="mt-1 font-medium text-ink">Marina Duarte</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-wide text-slate">
                    Atualização
                  </dt>
                  <dd className="mt-1 font-medium text-ink">Hoje, 09:42</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Card ink */}
          <div className="relative overflow-hidden rounded-card border border-line bg-ink p-6 text-white shadow-panel">
            <div className="absolute inset-y-0 left-0 w-1 bg-docket" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
              Princípio de composição
            </p>
            <h3 className="mt-3 font-display text-2xl font-bold">
              Uma ação principal por card.
            </h3>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Cards usam borda discreta, shadow-panel e evitam excesso de
              sombras. O conteúdo determina a hierarquia.
            </p>
          </div>
        </div>
      </section>

      {/* 08 · Alerts */}
      <section aria-labelledby="alerts-title">
        <SectionTitle label="08 · Feedback" title="Alertas e mensagens" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Alert variant="default">
            <AlertTitle>Informação</AlertTitle>
            <AlertDescription>
              Dados fictícios utilizados para validação do protótipo.
            </AlertDescription>
          </Alert>
          <Alert variant="success">
            <AlertTitle>Processo cadastrado</AlertTitle>
            <AlertDescription>
              O processo foi registrado com sucesso no sistema.
            </AlertDescription>
          </Alert>
          <Alert variant="warning">
            <AlertTitle>Prazo se aproximando</AlertTitle>
            <AlertDescription>
              O prazo de manifestação vence em 4 dias. Verifique os autos.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>Revise os dados de acesso</AlertTitle>
            <AlertDescription>
              Preencha corretamente os campos destacados.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* 09 · Dialog & Dropdown */}
      <section aria-labelledby="dialog-title">
        <SectionTitle
          label="09 · Overlays"
          title="Dialog e Dropdown Menu"
          description="Componentes interativos com acessibilidade por teclado."
        />
        <DialogExamples />
      </section>

      {/* 10 · Tabs */}
      <section aria-labelledby="tabs-title">
        <SectionTitle
          label="10 · Navegação"
          title="Tabs"
          description="Navegação em abas com contador e estados ativo/inativo."
        />
        <TabsExamples />
      </section>

      {/* 11 · Table */}
      <section aria-labelledby="table-title">
        <SectionTitle
          label="11 · Dados"
          title="Tabela de processos"
          description="Tabela visual estática com hover, bordas e células organizadas."
        />
        <div className="overflow-hidden rounded-card border border-line bg-white shadow-panel">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-mist">
                <TableHead>Número do processo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo de ação</TableHead>
                <TableHead>Última atualização</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.cnj}>
                  <TableCell>
                    <CnjNumber value={row.cnj} />
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-ink">{row.client}</p>
                  </TableCell>
                  <TableCell className="text-slate">{row.type}</TableCell>
                  <TableCell className="font-medium text-ink">
                    {row.date}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>
              Dados fictícios para demonstração do Design System.
            </TableCaption>
          </Table>
        </div>
      </section>

      {/* 12 · Skeletons */}
      <section aria-labelledby="skeleton-title">
        <SectionTitle
          label="12 · Loading"
          title="Skeletons"
          description="Estados de carregamento para texto, cards e linhas de tabela."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Skeleton de texto */}
          <div className="rounded-card border border-line bg-white p-6 shadow-panel">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-slate">
              Texto
            </p>
            <div className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          {/* Skeleton de card */}
          <div className="rounded-card border border-line bg-white p-6 shadow-panel">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-slate">
              Card
            </p>
            <Skeleton className="mb-4 h-28 w-full rounded-card" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="mt-2 h-4 w-3/4" />
            <Skeleton className="mt-4 h-9 w-1/3 rounded-control" />
          </div>

          {/* Skeleton de lista */}
          <div className="rounded-card border border-line bg-white p-6 shadow-panel">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-slate">
              Linha de tabela
            </p>
            <LoadingState rows={4} />
          </div>
        </div>
      </section>

      {/* 13 · Empty / Loading / Error states */}
      <section aria-labelledby="states-title">
        <SectionTitle
          label="13 · Estados"
          title="Vazios, carregamento e erro"
          description="Componentes compartilhados para estados de interface."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-card border border-line bg-white shadow-panel">
            <EmptyState
              icon={<Search aria-hidden="true" className="h-6 w-6" />}
              title="Nenhum resultado"
              description="Tente remover algum filtro ou buscar por outro número, cliente ou tipo de ação."
            />
          </div>
          <div className="rounded-card border border-line bg-white p-6 shadow-panel">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-slate">
              Carregando
            </p>
            <LoadingState rows={3} />
          </div>
          <div className="rounded-card border border-line bg-white shadow-panel">
            <ErrorState
              title="Falha ao carregar"
              description="Não foi possível buscar os processos. Verifique sua conexão."
            />
          </div>
        </div>
      </section>

      {/* 14 · Toasts */}
      <section aria-labelledby="toast-title">
        <SectionTitle
          label="14 · Notificações"
          title="Toasts com Sonner"
          description="Feedback visual não-bloqueante para ações do sistema."
        />
        <ToastExamples />
      </section>
    </main>

    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-5 py-8 text-sm text-slate sm:flex-row lg:px-8">
        <p>Processo Design System · Base visual reutilizável</p>
        <p className="font-mono text-xs">
          Inter · Source Serif 4 · IBM Plex Mono
        </p>
      </div>
    </footer>
  </div>
);

export default DesignSystemPage;
