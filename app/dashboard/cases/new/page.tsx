import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CaseForm } from "./feature/case-form";

const NewCasePage = async () => {
  return (
    <section className="mx-auto max-w-5xl">
      {/* Back link */}
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/dashboard/cases"
          className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-slate hover:text-ink focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para processos
        </Link>
        <span className="hidden rounded-full bg-navy-soft px-3 py-1.5 text-xs font-bold text-navy sm:inline">
          Novo cadastro
        </span>
      </div>

      {/* Page header */}
      <div className="mb-8">
        <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-navy">
          <span className="h-px w-8 bg-docket" aria-hidden="true" />
          Cadastro jurídico
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
          Novo processo
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate">
          Registre os dados essenciais para iniciar o acompanhamento do caso.
        </p>
      </div>

      {/* Form */}
      <CaseForm />
    </section>
  );
};

export default NewCasePage;
