import type { Metadata } from "next";
import { Logo } from "@/components/shared/logo";
import { LoginForm } from "./feature/login-form";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse a plataforma com seu nome de usuário e senha.",
};

const AuthPage = () => (
  <main className="flex flex-1 flex-col lg:grid lg:grid-cols-[.9fr_1.1fr]">
    {/* Presentation Section */}
    <section
      className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16"
      aria-label="Apresentação da plataforma"
    >
      <div className="absolute inset-y-0 left-0 w-2 bg-docket" />
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10" />
      <div className="absolute -right-16 top-10 h-72 w-72 rounded-full border border-white/10" />

      <div className="relative z-10">
        <Logo variant="dark" size="md" />
      </div>

      <div className="relative z-10 max-w-xl">
        <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-white/60">
          <span className="h-px w-10 bg-docket" />
          Gestão processual
        </p>
        <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-[-0.035em] xl:text-6xl">
          Processos, clientes e atendimentos. Tudo controlado.
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-8 text-white/70">
          Gerencie processos, movimentações, documentos e fichas de atendimento
          com uma plataforma construída para responsabilidade e eficiência.
        </p>

        <div className="mt-10 flex gap-5">
          <div className="relative h-32 w-4 shrink-0 border-l-2 border-docket">
            <span className="absolute -left-1.25 top-0 h-2 w-2 rounded-full bg-docket" />
            <span className="absolute -left-1.25 top-1/2 h-2 w-2 rounded-full bg-docket" />
            <span className="absolute -left-1.25 bottom-0 h-2 w-2 rounded-full bg-docket" />
          </div>
          <div className="space-y-6 text-sm text-white/70">
            <p>
              <strong className="block text-white">
                Processe com ordem
              </strong>
              Procurações, movimentações e prazos organizados em um único lugar.
            </p>
            <p>
              <strong className="block text-white">Atenda com precisão</strong>
              Registre e compartilhe fichas de atendimento com clientes.
            </p>
            <p>
              <strong className="block text-white">Gerencie clientes</strong>
              Histórico completo de interações e documentos por cliente.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Form Section */}
    <section className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:flex-none lg:px-12">
      <div className="w-full max-w-md">
        <div className="mb-10 lg:hidden">
          <Logo variant="light" size="sm" showTagline={false} />
        </div>

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
