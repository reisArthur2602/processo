"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const ToastExamples = () => (
  <div className="flex flex-wrap gap-3 rounded-card border border-line bg-white p-6 shadow-panel sm:p-8">
    <Button
      variant="default"
      onClick={() => toast.success("Processo salvo com sucesso")}
    >
      Toast success
    </Button>
    <Button
      variant="destructive"
      onClick={() => toast.error("Não foi possível concluir a operação")}
    >
      Toast error
    </Button>
    <Button
      variant="outline"
      onClick={() =>
        toast.warning("Prazo vence em 2 dias. Verifique os autos.")
      }
    >
      Toast warning
    </Button>
    <Button
      variant="ghost"
      onClick={() => toast.info("Novo andamento adicionado ao processo")}
    >
      Toast info
    </Button>
  </div>
);

export { ToastExamples };
