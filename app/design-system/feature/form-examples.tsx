"use client";

import { Mail, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const FormExamples = () => {
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<
    "default" | "error" | "success"
  >("default");
  const [emailError, setEmailError] = useState("");

  const validateEmail = () => {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    setEmailStatus(valid ? "success" : "error");
    setEmailError(valid ? "" : "Informe um e-mail válido.");
  };

  return (
    <div className="space-y-10">
      {/* Inputs */}
      <section>
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-slate">
          Inputs
        </p>
        <div className="grid gap-5 lg:grid-cols-3">
          <Field>
            <FieldLabel>Estado padrão</FieldLabel>
            <Input placeholder="Digite o nome do cliente" />
            <FieldDescription>Texto de ajuda opcional.</FieldDescription>
          </Field>

          <Field>
            <FieldLabel>Com ícone</FieldLabel>
            <Input placeholder="Buscar processo" leftIcon={<Search />} />
          </Field>

          <Field>
            <FieldLabel>Com prefixo / sufixo</FieldLabel>
            <Input
              type="number"
              placeholder="0,00"
              prefix="R$"
              suffix="reais"
            />
          </Field>

          <Field>
            <FieldLabel>Sucesso</FieldLabel>
            <Input
              status="success"
              defaultValue="cliente@exemplo.com"
              type="email"
            />
            <FieldDescription className="text-success font-medium">
              E-mail validado.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel>Erro</FieldLabel>
            <Input
              status="error"
              defaultValue="email-invalido"
              type="email"
              aria-invalid="true"
            />
            <FieldError>Informe um e-mail válido.</FieldError>
          </Field>

          <Field>
            <FieldLabel>Desabilitado</FieldLabel>
            <Input disabled defaultValue="Não editável" />
          </Field>
        </div>

        <div className="mt-5 rounded-card border border-line bg-white p-6 shadow-panel">
          <Field>
            <FieldLabel htmlFor="demo-email">Validação interativa</FieldLabel>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                id="demo-email"
                type="email"
                placeholder="nome@escritorio.com.br"
                value={email}
                status={emailStatus}
                leftIcon={<Mail />}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailStatus("default");
                  setEmailError("");
                }}
              />
              <Button onClick={validateEmail} className="shrink-0">
                Validar
              </Button>
            </div>
            {emailError && <FieldError>{emailError}</FieldError>}
            {emailStatus === "success" && (
              <FieldDescription className="text-success font-medium">
                E-mail válido!
              </FieldDescription>
            )}
          </Field>
        </div>
      </section>

      {/* Textarea */}
      <section>
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-slate">
          Textarea
        </p>
        <div className="grid gap-5 lg:grid-cols-3">
          <Field>
            <FieldLabel>Padrão</FieldLabel>
            <Textarea placeholder="Descreva a movimentação processual…" />
          </Field>
          <Field>
            <FieldLabel>Erro</FieldLabel>
            <Textarea status="error" defaultValue="Texto com erro" />
            <FieldError>Campo obrigatório.</FieldError>
          </Field>
          <Field>
            <FieldLabel>Desabilitado</FieldLabel>
            <Textarea disabled defaultValue="Não editável" />
          </Field>
        </div>
      </section>

      {/* Select */}
      <section>
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-slate">
          Select
        </p>
        <div className="grid gap-5 lg:grid-cols-3">
          <Field>
            <FieldLabel>Status do processo</FieldLabel>
            <Select>
              <option value="">Selecione…</option>
              <option value="active">Ativo</option>
              <option value="suspended">Suspenso</option>
              <option value="archived">Arquivado</option>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Erro</FieldLabel>
            <Select status="error">
              <option value="">Selecione…</option>
              <option value="tjrj">TJRJ</option>
              <option value="tjsp">TJSP</option>
            </Select>
            <FieldError>Selecione um tribunal.</FieldError>
          </Field>
          <Field>
            <FieldLabel>Desabilitado</FieldLabel>
            <Select disabled defaultValue="active">
              <option value="active">Ativo</option>
            </Select>
          </Field>
        </div>
      </section>
    </div>
  );
};

export { FormExamples };
