"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardPlus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import {
  type CreateIntakeInput,
  createIntakeSchema,
  SERVICE_AREAS,
} from "@/schema/create-intake-schema";
import { createIntake } from "../actions/create-intake";

interface NewIntakeButtonProps {
  clientId: string;
  attendedAtLabel: string;
  responsibleName: string;
}

const NewIntakeButton = ({
  clientId,
  attendedAtLabel,
  responsibleName,
}: NewIntakeButtonProps) => {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateIntakeInput>({
    resolver: zodResolver(createIntakeSchema),
    defaultValues: { serviceArea: "" },
  });

  const handleClose = () => {
    reset({ serviceArea: "" });
    setOpen(false);
  };

  const onSubmit = async (data: CreateIntakeInput) => {
    const result = await createIntake(clientId, data);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    handleClose();
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <ClipboardPlus className="h-4 w-4" aria-hidden="true" />
        Nova ficha de atendimento
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg overflow-hidden p-0 sm:p-0 [&>button:last-child]:hidden">
          <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy">
                Atendimento
              </p>
              <DialogTitle className="mt-1">
                Nova ficha de atendimento
              </DialogTitle>
              <DialogDescription className="mt-1">
                Registre um novo atendimento para este cliente.
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
            className="px-6 py-6"
          >
            <Alert>
              <AlertTitle>Preenchimento automático</AlertTitle>
              <AlertDescription>
                Data/hora e advogado responsável são preenchidos automaticamente
                com {attendedAtLabel} · {responsibleName}
              </AlertDescription>
            </Alert>

            <Field className="mt-5">
              <FieldLabel>
                Área de atendimento{" "}
                <span className="text-danger" aria-hidden="true">
                  *
                </span>
              </FieldLabel>
              <Select
                status={errors.serviceArea ? "error" : "default"}
                {...register("serviceArea")}
              >
                <option value="">Selecione a área de atendimento</option>
                {SERVICE_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </Select>
              <FieldError>{errors.serviceArea?.message}</FieldError>
            </Field>

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" loading={isSubmitting}>
                Cadastrar ficha
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { NewIntakeButton };
