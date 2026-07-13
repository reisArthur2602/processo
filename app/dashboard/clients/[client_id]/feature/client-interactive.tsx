"use client";

import {
  Briefcase,
  Cake,
  ClipboardList,
  FileText,
  GraduationCap,
  Heart,
  Mail,
  MapPin,
  Pencil,
  Phone,
  UserSquare2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { NewCaseButton } from "@/app/dashboard/cases/new/feature/new-case-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDocument, formatPhone } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ClientFormDialog } from "../../feature/client-form-dialog";
import type { ClientRow } from "../../feature/clients-columns";
import { NewIntakeButton } from "./new-intake-button";

export type ClientCaseRow = {
  id: string;
  number: string | null;
  title: string;
  serviceArea: string;
  actionType: string | null;
  status: "ACTIVE" | "SUSPENDED" | "ARCHIVED" | "CLOSED";
  updatedAt: string;
};

export type ClientIntakeRow = {
  id: string;
  number: string;
  status: "DRAFT" | "OPEN" | "FINALIZED" | "CONVERTED" | "CANCELED";
  serviceArea: string;
  attendedAt: string;
  finalizedAt: string | null;
  responsibleName: string;
};

const PERSON_TYPE_LABELS: Record<ClientRow["personType"], string> = {
  INDIVIDUAL: "Pessoa física",
  COMPANY: "Pessoa jurídica",
};

const CLIENT_STATUS_LABELS: Record<ClientRow["status"], string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  PROSPECT: "Prospecto",
};

const CLIENT_STATUS_VARIANTS = {
  ACTIVE: "success",
  INACTIVE: "neutral",
  PROSPECT: "warning",
} as const;

const CASE_STATUS_LABELS: Record<ClientCaseRow["status"], string> = {
  ACTIVE: "Ativo",
  SUSPENDED: "Suspenso",
  ARCHIVED: "Arquivado",
  CLOSED: "Encerrado",
};

const CASE_STATUS_VARIANTS = {
  ACTIVE: "success",
  SUSPENDED: "warning",
  ARCHIVED: "neutral",
  CLOSED: "outline",
} as const;

const INTAKE_STATUS_LABELS: Record<ClientIntakeRow["status"], string> = {
  DRAFT: "Rascunho",
  OPEN: "Em andamento",
  FINALIZED: "Finalizada",
  CONVERTED: "Convertida em processo",
  CANCELED: "Cancelada",
};

const INTAKE_STATUS_VARIANTS = {
  DRAFT: "neutral",
  OPEN: "warning",
  FINALIZED: "success",
  CONVERTED: "success",
  CANCELED: "danger",
} as const;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

interface ClientInteractiveProps {
  client: ClientRow;
  cases: ClientCaseRow[];
  intakes: ClientIntakeRow[];
  attendedAtLabel: string;
  responsibleName: string;
}

const ClientInteractive = ({
  client,
  cases,
  intakes,
  attendedAtLabel,
  responsibleName,
}: ClientInteractiveProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"cases" | "intakes">("cases");

  return (
    <>
      {/* ── Hero ── */}
      <section className="mb-8">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={CLIENT_STATUS_VARIANTS[client.status]} dot>
                {CLIENT_STATUS_LABELS[client.status]}
              </Badge>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate">
                {PERSON_TYPE_LABELS[client.personType]}
              </span>
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
              {client.name}
            </h1>
            {client.document && (
              <p className="mt-3 text-sm text-slate">
                {formatDocument(client.document)}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4" />
              Editar cliente
            </Button>
            <NewIntakeButton
              clientId={client.id}
              attendedAtLabel={attendedAtLabel}
              responsibleName={responsibleName}
            />
            <NewCaseButton clientId={client.id} clientName={client.name} />
          </div>
        </div>
      </section>

      {/* ── Two-column body ── */}
      <div className="grid items-start gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="space-y-5 xl:sticky xl:top-28">
          <section
            className="overflow-hidden rounded-card border border-line bg-white shadow-panel"
            aria-labelledby="client-data-title"
          >
            <div className="border-b border-line bg-ink px-6 py-5 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                Contato
              </p>
              <h2
                id="client-data-title"
                className="mt-1 font-display text-2xl font-bold"
              >
                Dados do cliente
              </h2>
            </div>
            <dl className="divide-y divide-line px-6">
              <div className="flex items-start gap-3 py-5">
                <UserSquare2 className="mt-0.5 h-4 w-4 shrink-0 text-slate" />
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate">
                    Documento
                  </dt>
                  <dd className="mt-1 font-semibold">
                    {client.document ? formatDocument(client.document) : "—"}
                  </dd>
                </div>
              </div>
              {client.rg && (
                <div className="flex items-start gap-3 py-5">
                  <UserSquare2 className="mt-0.5 h-4 w-4 shrink-0 text-slate" />
                  <div>
                    <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate">
                      RG
                    </dt>
                    <dd className="mt-1 font-semibold">{client.rg}</dd>
                  </div>
                </div>
              )}
              {client.birthDate && (
                <div className="flex items-start gap-3 py-5">
                  <Cake className="mt-0.5 h-4 w-4 shrink-0 text-slate" />
                  <div>
                    <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate">
                      Nascimento
                    </dt>
                    <dd className="mt-1 font-semibold">
                      {formatDate(client.birthDate)}
                    </dd>
                  </div>
                </div>
              )}
              {client.maritalStatus && (
                <div className="flex items-start gap-3 py-5">
                  <Heart className="mt-0.5 h-4 w-4 shrink-0 text-slate" />
                  <div>
                    <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate">
                      Estado civil
                    </dt>
                    <dd className="mt-1 font-semibold">
                      {client.maritalStatus}
                    </dd>
                  </div>
                </div>
              )}
              {client.profession && (
                <div className="flex items-start gap-3 py-5">
                  <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-slate" />
                  <div>
                    <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate">
                      Profissão
                    </dt>
                    <dd className="mt-1 font-semibold">{client.profession}</dd>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3 py-5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate" />
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate">
                    Telefone
                  </dt>
                  <dd className="mt-1 font-semibold">
                    {client.phone ? formatPhone(client.phone) : "—"}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3 py-5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate" />
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate">
                    E-mail
                  </dt>
                  <dd className="mt-1 font-semibold">{client.email ?? "—"}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3 py-5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate" />
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate">
                    Endereço
                  </dt>
                  <dd className="mt-1 font-semibold">
                    {client.street
                      ? `${client.street}${client.number ? `, ${client.number}` : ""}${client.complement ? ` — ${client.complement}` : ""}`
                      : "—"}
                  </dd>
                  {(client.district || client.city) && (
                    <dd className="mt-1 text-sm text-slate">
                      {[client.district, client.city, client.state]
                        .filter(Boolean)
                        .join(" — ")}
                    </dd>
                  )}
                  {client.zipCode && (
                    <dd className="mt-1 text-xs text-slate">
                      CEP {client.zipCode}
                    </dd>
                  )}
                </div>
              </div>
              {client.notes && (
                <div className="py-5">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate">
                    Observações
                  </dt>
                  <dd className="mt-2 text-sm leading-6 text-slate">
                    {client.notes}
                  </dd>
                </div>
              )}
            </dl>
          </section>
        </aside>

        {/* Activity section */}
        <section
          className="min-w-0 overflow-hidden rounded-card border border-line bg-white shadow-panel"
          aria-labelledby="client-history-title"
        >
          <div className="border-b border-line px-5 pt-5 sm:px-6 sm:pt-6">
            <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-navy">
                  Histórico do cliente
                </p>
                <h2
                  id="client-history-title"
                  className="mt-2 font-display text-3xl font-bold"
                >
                  Processos e atendimentos
                </h2>
              </div>
            </div>

            {/* Tab buttons */}
            <div
              className="flex gap-1 overflow-x-auto"
              role="tablist"
              aria-label="Conteúdo do cliente"
            >
              {(["cases", "intakes"] as const).map((tab) => {
                const label =
                  tab === "cases" ? "Processos" : "Fichas de atendimento";
                const count = tab === "cases" ? cases.length : intakes.length;
                const active = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    id={`tab-${tab}`}
                    aria-selected={active}
                    aria-controls={`panel-${tab}`}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-navy",
                      active
                        ? "border-navy text-navy"
                        : "border-transparent text-slate hover:text-ink",
                    )}
                  >
                    {label}{" "}
                    <span
                      className={cn(
                        "ml-1 rounded-full px-2 py-0.5 text-[10px]",
                        active ? "bg-navy-soft" : "bg-mist",
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cases panel */}
          {activeTab === "cases" && (
            <div
              id="panel-cases"
              role="tabpanel"
              aria-labelledby="tab-cases"
              className="p-5 sm:p-7"
            >
              {cases.length === 0 ? (
                <div className="py-12 text-center">
                  <Briefcase className="mx-auto mb-3 h-8 w-8 text-line" />
                  <p className="text-sm font-medium text-slate">
                    Nenhum processo vinculado a este cliente.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cases.map((c) => (
                    <Link
                      key={c.id}
                      href={`/dashboard/cases/${c.id}`}
                      className="flex flex-col justify-between gap-3 rounded-xl border border-line p-4 transition hover:border-navy/30 hover:bg-navy-soft/30 sm:flex-row sm:items-center"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {c.number ?? c.title}
                        </p>
                        <p className="mt-1 text-xs text-slate">
                          {c.serviceArea}
                          {c.actionType ? ` · ${c.actionType}` : ""} ·{" "}
                          {formatDate(c.updatedAt)}
                        </p>
                      </div>
                      <Badge variant={CASE_STATUS_VARIANTS[c.status]} dot>
                        {CASE_STATUS_LABELS[c.status]}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Intakes panel */}
          {activeTab === "intakes" && (
            <div
              id="panel-intakes"
              role="tabpanel"
              aria-labelledby="tab-intakes"
              className="p-5 sm:p-7"
            >
              {intakes.length === 0 ? (
                <div className="py-12 text-center">
                  <ClipboardList className="mx-auto mb-3 h-8 w-8 text-line" />
                  <p className="text-sm font-medium text-slate">
                    Nenhuma ficha de atendimento registrada.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {intakes.map((intake) => (
                    <Link
                      key={intake.id}
                      href={`/dashboard/clients/${client.id}/intakes/${intake.id}`}
                      className="flex flex-col justify-between gap-3 rounded-xl border border-line p-4 transition hover:border-navy/30 hover:bg-navy-soft/30 sm:flex-row sm:items-center"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-mist text-slate">
                          <FileText className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {intake.number} · {intake.serviceArea}
                          </p>
                          <p className="mt-1 text-xs text-slate">
                            Atendido em {formatDate(intake.attendedAt)} por{" "}
                            {intake.responsibleName}
                            {intake.finalizedAt
                              ? ` · Finalizado em ${formatDate(intake.finalizedAt)}`
                              : ""}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={INTAKE_STATUS_VARIANTS[intake.status]}
                        dot
                      >
                        {INTAKE_STATUS_LABELS[intake.status]}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* ── Edit client dialog ── */}
      <ClientFormDialog
        client={client}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
};

export { ClientInteractive };
