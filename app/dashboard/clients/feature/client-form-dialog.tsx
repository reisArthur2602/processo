"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatCep, formatDocument, formatPhone } from "@/lib/format";
import {
  type CreateClientInput,
  createClientSchema,
  MARITAL_STATUSES,
} from "@/schema/create-client-schema";
import { createClient } from "../actions/create-client";
import { updateClient } from "../actions/update-client";
import type { ClientRow } from "./clients-columns";

interface ClientFormDialogProps {
  client?: ClientRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EMPTY_VALUES: CreateClientInput = {
  personType: "INDIVIDUAL",
  status: "PROSPECT",
  name: "",
  document: "",
  rg: "",
  birthDate: "",
  maritalStatus: "",
  profession: "",
  phone: "",
  email: "",
  zipCode: "",
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  state: "",
  notes: "",
};

const toDateInputValue = (iso: string | null) => (iso ? iso.slice(0, 10) : "");

const ClientFormDialog = ({
  client,
  open,
  onOpenChange,
}: ClientFormDialogProps) => {
  const isEdit = !!client;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateClientInput>({
    resolver: zodResolver(createClientSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (!open) return;
    reset(
      client
        ? {
            personType: client.personType,
            status: client.status,
            name: client.name,
            document: client.document ?? "",
            rg: client.rg ?? "",
            birthDate: toDateInputValue(client.birthDate),
            maritalStatus: client.maritalStatus ?? "",
            profession: client.profession ?? "",
            phone: client.phone ?? "",
            email: client.email ?? "",
            zipCode: client.zipCode ?? "",
            street: client.street ?? "",
            number: client.number ?? "",
            complement: client.complement ?? "",
            district: client.district ?? "",
            city: client.city ?? "",
            state: client.state ?? "",
            notes: client.notes ?? "",
          }
        : EMPTY_VALUES,
    );
  }, [open, client, reset]);

  const handleClose = () => {
    reset(EMPTY_VALUES);
    onOpenChange(false);
  };

  const onSubmit = async (data: CreateClientInput) => {
    const result = isEdit
      ? await updateClient(client.id, data)
      : await createClient(data);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl overflow-hidden p-0 sm:p-0 [&>button:last-child]:hidden">
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy">
              Clientes
            </p>
            <DialogTitle className="mt-1">
              {isEdit ? "Editar cliente" : "Cadastrar cliente"}
            </DialogTitle>
            <DialogDescription className="mt-1">
              {isEdit
                ? "Altere os dados cadastrais do cliente."
                : "Preencha os dados para cadastrar um novo cliente."}
            </DialogDescription>
          </div>
          <DialogClose className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-slate hover:bg-mist hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-navy">
            <X className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Fechar</span>
          </DialogClose>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="max-h-[calc(100vh-12rem)] overflow-y-auto"
        >
          <div className="space-y-6 px-6 py-6">
            <fieldset>
              <legend className="text-sm font-bold uppercase tracking-[0.12em] text-slate">
                Dados gerais
              </legend>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>Tipo</FieldLabel>
                  <Select {...register("personType")}>
                    <option value="INDIVIDUAL">Pessoa física</option>
                    <option value="COMPANY">Pessoa jurídica</option>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <Select {...register("status")}>
                    <option value="PROSPECT">Prospecto</option>
                    <option value="ACTIVE">Ativo</option>
                    <option value="INACTIVE">Inativo</option>
                  </Select>
                </Field>

                <Field className="sm:col-span-2">
                  <FieldLabel>
                    Nome{" "}
                    <span className="text-danger" aria-hidden="true">
                      *
                    </span>
                  </FieldLabel>
                  <Input
                    {...register("name")}
                    placeholder="Nome completo ou razão social"
                    status={errors.name ? "error" : "default"}
                  />
                  <FieldError>{errors.name?.message}</FieldError>
                </Field>

                <Field>
                  <FieldLabel>
                    Documento{" "}
                    <span className="text-xs font-normal text-slate">
                      (opcional)
                    </span>
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="document"
                    render={({ field }) => (
                      <Input
                        placeholder="CPF ou CNPJ"
                        inputMode="numeric"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(formatDocument(e.target.value))
                        }
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    )}
                  />
                </Field>

                <Field>
                  <FieldLabel>
                    RG{" "}
                    <span className="text-xs font-normal text-slate">
                      (opcional)
                    </span>
                  </FieldLabel>
                  <Input {...register("rg")} placeholder="00.000.000-0" />
                </Field>

                <Field>
                  <FieldLabel>
                    Data de nascimento{" "}
                    <span className="text-xs font-normal text-slate">
                      (opcional)
                    </span>
                  </FieldLabel>
                  <Input type="date" {...register("birthDate")} />
                </Field>

                <Field>
                  <FieldLabel>
                    Estado civil{" "}
                    <span className="text-xs font-normal text-slate">
                      (opcional)
                    </span>
                  </FieldLabel>
                  <Select {...register("maritalStatus")}>
                    <option value="">Selecione</option>
                    {MARITAL_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field className="sm:col-span-2">
                  <FieldLabel>
                    Profissão{" "}
                    <span className="text-xs font-normal text-slate">
                      (opcional)
                    </span>
                  </FieldLabel>
                  <Input {...register("profession")} />
                </Field>
              </div>
            </fieldset>

            <div className="border-t border-line" />

            <fieldset>
              <legend className="text-sm font-bold uppercase tracking-[0.12em] text-slate">
                Contato
              </legend>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>
                    Telefone{" "}
                    <span className="text-xs font-normal text-slate">
                      (opcional)
                    </span>
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field }) => (
                      <Input
                        placeholder="(00) 00000-0000"
                        inputMode="tel"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(formatPhone(e.target.value))
                        }
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    )}
                  />
                </Field>

                <Field>
                  <FieldLabel>
                    E-mail{" "}
                    <span className="text-xs font-normal text-slate">
                      (opcional)
                    </span>
                  </FieldLabel>
                  <Input
                    type="email"
                    {...register("email")}
                    placeholder="cliente@email.com"
                    status={errors.email ? "error" : "default"}
                  />
                  <FieldError>{errors.email?.message}</FieldError>
                </Field>
              </div>
            </fieldset>

            <div className="border-t border-line" />

            <fieldset>
              <legend className="text-sm font-bold uppercase tracking-[0.12em] text-slate">
                Endereço
              </legend>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>
                    CEP{" "}
                    <span className="text-xs font-normal text-slate">
                      (opcional)
                    </span>
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="zipCode"
                    render={({ field }) => (
                      <Input
                        placeholder="00000-000"
                        inputMode="numeric"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(formatCep(e.target.value))
                        }
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    )}
                  />
                </Field>

                <Field>
                  <FieldLabel>
                    Cidade{" "}
                    <span className="text-xs font-normal text-slate">
                      (opcional)
                    </span>
                  </FieldLabel>
                  <Input
                    {...register("city")}
                    placeholder="Ex.: Rio de Janeiro"
                  />
                </Field>

                <Field className="sm:col-span-2">
                  <FieldLabel>
                    Rua{" "}
                    <span className="text-xs font-normal text-slate">
                      (opcional)
                    </span>
                  </FieldLabel>
                  <Input {...register("street")} />
                </Field>

                <Field>
                  <FieldLabel>
                    Número{" "}
                    <span className="text-xs font-normal text-slate">
                      (opcional)
                    </span>
                  </FieldLabel>
                  <Input {...register("number")} />
                </Field>

                <Field>
                  <FieldLabel>
                    Complemento{" "}
                    <span className="text-xs font-normal text-slate">
                      (opcional)
                    </span>
                  </FieldLabel>
                  <Input {...register("complement")} />
                </Field>

                <Field>
                  <FieldLabel>
                    Bairro{" "}
                    <span className="text-xs font-normal text-slate">
                      (opcional)
                    </span>
                  </FieldLabel>
                  <Input {...register("district")} />
                </Field>

                <Field>
                  <FieldLabel>
                    UF{" "}
                    <span className="text-xs font-normal text-slate">
                      (opcional)
                    </span>
                  </FieldLabel>
                  <Input
                    {...register("state")}
                    placeholder="Ex.: RJ"
                    maxLength={2}
                  />
                </Field>
              </div>
            </fieldset>

            <div className="border-t border-line" />

            <Field>
              <FieldLabel>
                Observações{" "}
                <span className="text-xs font-normal text-slate">
                  (opcional)
                </span>
              </FieldLabel>
              <Textarea
                {...register("notes")}
                rows={3}
                placeholder="Anotações internas sobre o cliente"
              />
            </Field>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-line bg-mist/60 px-6 py-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {isEdit ? "Salvar alterações" : "Cadastrar cliente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { ClientFormDialog };
