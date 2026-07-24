import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Badge } from "@/components/ui/badge";
import { formatAddress } from "@/lib/format";
import prisma from "@/lib/prisma";
import { DeleteIntakeButton } from "./delete-intake-button";
import { GenerateIntakeReportButton } from "./generate-intake-report-button";
import { IntakeForm } from "./intake-form";
import { SendIntakeEmailButton } from "./send-intake-email-button";

const STATUS_LABELS = {
  DRAFT: "Rascunho",
  OPEN: "Em andamento",
  FINALIZED: "Finalizada",
  CONVERTED: "Convertida em processo",
  CANCELED: "Cancelada",
} as const;

const STATUS_VARIANTS = {
  DRAFT: "neutral",
  OPEN: "warning",
  FINALIZED: "success",
  CONVERTED: "success",
  CANCELED: "danger",
} as const;

const getIntakeDetail = cache(async (clientId: string, intakeId: string) => {
  return prisma.intake.findFirst({
    where: { id: intakeId, clientId },
    include: {
      client: {
        select: {
          name: true,
          email: true,
          document: true,
          phone: true,
          zipCode: true,
          street: true,
          number: true,
          complement: true,
          district: true,
          city: true,
          state: true,
        },
      },
      responsible: { select: { name: true } },
    },
  });
});

const IntakeDetailData = async ({
  clientId,
  intakeId,
}: {
  clientId: string;
  intakeId: string;
}) => {
  const intake = await getIntakeDetail(clientId, intakeId);

  if (!intake) notFound();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <Link
          href={`/dashboard/clients/${clientId}`}
          className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-slate transition hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para {intake.client.name}
        </Link>
      </div>

      <section className="mb-8">
        <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-navy">
          <span className="h-px w-8 bg-docket" aria-hidden="true" />
          Ficha de atendimento
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
            {intake.number}
          </h1>
          <Badge variant={STATUS_VARIANTS[intake.status]} dot>
            {STATUS_LABELS[intake.status]}
          </Badge>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate">
          {intake.serviceArea} · Atendido em{" "}
          {intake.attendedAt.toLocaleDateString("pt-BR")} por{" "}
          {intake.responsible.name}
        </p>
      </section>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <SendIntakeEmailButton
          clientId={clientId}
          intakeId={intake.id}
          clientEmail={intake.client.email}
        />
        <DeleteIntakeButton
          clientId={clientId}
          intakeId={intake.id}
          intakeNumber={intake.number}
        />
        <GenerateIntakeReportButton
          data={{
            number: intake.number,
            clientName: intake.client.name,
            clientDocument: intake.client.document,
            clientPhone: intake.client.phone,
            clientAddress: formatAddress(intake.client),
            clientReport: intake.clientReport,
            preliminaryAnalysis: intake.preliminaryAnalysis,
            providences: intake.providences,
            otherProvidence: intake.otherProvidence,
            feeAmount: intake.feeAmount ? Number(intake.feeAmount) : null,
            amountReceived: intake.amountReceived
              ? Number(intake.amountReceived)
              : null,
            paymentMethod: intake.paymentMethod,
            paymentNotes: intake.paymentNotes,
          }}
        />
      </div>

      <IntakeForm
        clientId={clientId}
        intakeId={intake.id}
        initialData={{
          clientReport: intake.clientReport ?? "",
          preliminaryAnalysis: intake.preliminaryAnalysis ?? "",
          providences: intake.providences,
          otherProvidence: intake.otherProvidence ?? "",
          feeAmount: intake.feeAmount ? String(intake.feeAmount) : "",
          amountReceived: intake.amountReceived
            ? String(intake.amountReceived)
            : "",
          paymentMethod: intake.paymentMethod ?? "",
          paymentNotes: intake.paymentNotes ?? "",
        }}
      />
    </div>
  );
};

export { IntakeDetailData };
