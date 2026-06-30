import { LoginForm } from "./feature/login-form";

const AuthPage = () => (
  <main className="grid min-h-screen lg:grid-cols-[.9fr_1.1fr]">
    {/* Presentation Section */}
    <section
      className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16"
      aria-label="Apresentação da plataforma"
    >
      <div className="absolute inset-y-0 left-0 w-2 bg-docket" />
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10" />
      <div className="absolute -right-16 top-10 h-72 w-72 rounded-full border border-white/10" />

      <a
        href="/design-system"
        className="relative z-10 flex w-fit items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-ink"
      >
        <span
          className="grid h-11 w-11 place-items-center rounded-xl bg-white text-ink shadow-lift"
          aria-hidden="true"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M6 4h12M8 4v16m8-16v16M5 20h14M10 8h4M10 12h4M10 16h4" />
          </svg>
        </span>
        <span>
          <span className="block font-display text-2xl font-bold leading-none">
            Processo
          </span>
          <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">
            Sistema jurídico
          </span>
        </span>
      </a>

      <div className="relative z-10 max-w-xl">
        <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-white/60">
          <span className="h-px w-10 bg-docket" />
          Gestão jurídica
        </p>
        <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-[-0.035em] xl:text-6xl">
          Seu escritório com os processos em ordem.
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-8 text-white/70">
          Acompanhe andamentos, documentos e partes com uma visão única,
          construída para decisões rápidas e responsáveis.
        </p>

        <div className="mt-10 flex gap-5">
          <div className="relative h-32 w-4 shrink-0 border-l-2 border-docket">
            <span className="absolute -left-[5px] top-0 h-2 w-2 rounded-full bg-docket" />
            <span className="absolute -left-[5px] top-1/2 h-2 w-2 rounded-full bg-docket" />
            <span className="absolute -left-[5px] bottom-0 h-2 w-2 rounded-full bg-docket" />
          </div>
          <div className="space-y-6 text-sm text-white/70">
            <p>
              <strong className="block text-white">
                Centralize o histórico
              </strong>
              Movimentações e documentos na mesma linha do tempo.
            </p>
            <p>
              <strong className="block text-white">Proteja o foco</strong>
              Informação essencial sem excesso visual.
            </p>
            <p>
              <strong className="block text-white">Aja com contexto</strong>
              Dados das partes sempre ao alcance.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Form Section */}
    <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
      <div className="w-full max-w-md">
        <a
          href="/design-system"
          className="mb-10 flex items-center gap-3 lg:hidden"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-white">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M6 4h12M8 4v16m8-16v16M5 20h14M10 8h4M10 12h4M10 16h4" />
            </svg>
          </span>
          <span className="font-display text-2xl font-bold">Processo</span>
        </a>

        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-navy">
            Acesso seguro
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-[-0.03em]">
            Entre na sua conta
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate">
            Use seu nome de usuário para acessar o painel.
          </p>
        </div>

        <LoginForm />
      </div>
    </section>
  </main>
);

export default AuthPage;
