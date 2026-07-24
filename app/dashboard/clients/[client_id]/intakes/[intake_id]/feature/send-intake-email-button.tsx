"use client";

import { Mail, MailCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { sendIntakeEmailAction } from "../actions/send-intake-email";

interface SendIntakeEmailButtonProps {
  clientId: string;
  intakeId: string;
  clientEmail: string | null;
}

const SendIntakeEmailButton = ({
  clientId,
  intakeId,
  clientEmail,
}: SendIntakeEmailButtonProps) => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!clientEmail) {
      toast.error("O cliente não possui e-mail cadastrado.");
      return;
    }
    setSending(true);
    const result = await sendIntakeEmailAction(clientId, intakeId);
    setSending(false);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    setSent(true);
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant={sent ? "outline" : "default"}
        onClick={handleSend}
        loading={sending}
        disabled={!clientEmail}
        title={!clientEmail ? "O cliente não possui e-mail cadastrado" : undefined}
      >
        {sent ? (
          <MailCheck className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Mail className="h-4 w-4" aria-hidden="true" />
        )}
        {sending ? "Enviando…" : sent ? "Reenviar ficha" : "Enviar ficha por e-mail"}
      </Button>
      {!clientEmail && (
        <p className="text-xs text-slate">
          Cadastre um e-mail para o cliente para habilitar o envio.
        </p>
      )}
    </div>
  );
};

export { SendIntakeEmailButton };
