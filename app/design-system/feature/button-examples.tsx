"use client";

import { ArrowRight, Download, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const ButtonExamples = () => {
  const [loading, setLoading] = useState(false);

  const handleLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="space-y-8 rounded-card border border-line bg-white p-6 shadow-panel sm:p-8">
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate">
          Variantes
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Salvar processo</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="outline">Cancelar</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="soft">Soft</Button>
          <Button variant="destructive">Excluir</Button>
          <Button variant="link">Ver detalhes</Button>
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate">
          Tamanhos
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Pequeno</Button>
          <Button size="default">Padrão</Button>
          <Button size="lg">Grande</Button>
          <Button size="icon" aria-label="Adicionar">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate">
          Com ícones
        </p>
        <div className="flex flex-wrap gap-3">
          <Button>
            <Plus className="h-4 w-4" />
            Novo processo
          </Button>
          <Button variant="outline">
            Baixar relatório
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="secondary">
            Continuar
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate">
          Estados
        </p>
        <div className="flex flex-wrap gap-3">
          <Button disabled>Desabilitado</Button>
          <Button variant="outline" disabled>
            Outline desabilitado
          </Button>
          <Button loading={loading} onClick={handleLoading}>
            {loading ? "Salvando…" : "Salvar (teste loading)"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export { ButtonExamples };
