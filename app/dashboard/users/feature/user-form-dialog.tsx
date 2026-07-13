"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import {
  type CreateUserInput,
  createUserSchema,
} from "@/schema/create-user-schema";
import {
  type UpdateUserInput,
  updateUserSchema,
} from "@/schema/update-user-schema";
import { createUser } from "../actions/create-user";
import { updateUser } from "../actions/update-user";
import type { UserRow } from "./users-columns";

interface UserFormDialogProps {
  user?: UserRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CREATE_EMPTY: CreateUserInput = {
  name: "",
  username: "",
  password: "",
  confirmPassword: "",
  admin: false,
};

const CreateUserForm = ({ onDone }: { onDone: () => void }) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: CREATE_EMPTY,
  });

  const onSubmit = async (data: CreateUserInput) => {
    const result = await createUser(data);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    reset(CREATE_EMPTY);
    onDone();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-4 px-6 py-6">
        <Field>
          <FieldLabel>
            Nome{" "}
            <span className="text-danger" aria-hidden="true">
              *
            </span>
          </FieldLabel>
          <Input
            {...register("name")}
            placeholder="Nome completo"
            status={errors.name ? "error" : "default"}
          />
          <FieldError>{errors.name?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>
            Usuário{" "}
            <span className="text-danger" aria-hidden="true">
              *
            </span>
          </FieldLabel>
          <Input
            {...register("username")}
            placeholder="Ex.: ana.carvalho"
            autoComplete="off"
            status={errors.username ? "error" : "default"}
          />
          <FieldError>{errors.username?.message}</FieldError>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>
              Senha{" "}
              <span className="text-danger" aria-hidden="true">
                *
              </span>
            </FieldLabel>
            <Input
              type="password"
              {...register("password")}
              autoComplete="new-password"
              status={errors.password ? "error" : "default"}
            />
            <FieldError>{errors.password?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>
              Confirmar senha{" "}
              <span className="text-danger" aria-hidden="true">
                *
              </span>
            </FieldLabel>
            <Input
              type="password"
              {...register("confirmPassword")}
              autoComplete="new-password"
              status={errors.confirmPassword ? "error" : "default"}
            />
            <FieldError>{errors.confirmPassword?.message}</FieldError>
          </Field>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-line bg-mist/60 p-4">
          <div>
            <p className="text-sm font-semibold text-ink">Administrador</p>
            <p className="mt-0.5 text-xs text-slate">
              Administradores podem gerenciar outros usuários.
            </p>
          </div>
          <Controller
            control={control}
            name="admin"
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-label="Administrador"
              />
            )}
          />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-line bg-mist/60 px-6 py-5 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onDone}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting}>
          Cadastrar usuário
        </Button>
      </div>
    </form>
  );
};

const EditUserForm = ({
  user,
  onDone,
}: {
  user: UserRow;
  onDone: () => void;
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name,
      admin: user.admin,
      isActive: user.isActive,
    },
  });

  const onSubmit = async (data: UpdateUserInput) => {
    const result = await updateUser(user.id, data);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    onDone();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-4 px-6 py-6">
        <Field>
          <FieldLabel>
            Nome{" "}
            <span className="text-danger" aria-hidden="true">
              *
            </span>
          </FieldLabel>
          <Input
            {...register("name")}
            status={errors.name ? "error" : "default"}
          />
          <FieldError>{errors.name?.message}</FieldError>
        </Field>

        <div className="flex items-center justify-between rounded-xl border border-line bg-mist/60 p-4">
          <div>
            <p className="text-sm font-semibold text-ink">Administrador</p>
            <p className="mt-0.5 text-xs text-slate">
              Administradores podem gerenciar outros usuários.
            </p>
          </div>
          <Controller
            control={control}
            name="admin"
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-label="Administrador"
              />
            )}
          />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-line bg-mist/60 p-4">
          <div>
            <p className="text-sm font-semibold text-ink">Conta ativa</p>
            <p className="mt-0.5 text-xs text-slate">
              Usuários inativos não conseguem fazer login.
            </p>
          </div>
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-label="Conta ativa"
              />
            )}
          />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-line bg-mist/60 px-6 py-5 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onDone}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting}>
          Salvar alterações
        </Button>
      </div>
    </form>
  );
};

const UserFormDialog = ({ user, open, onOpenChange }: UserFormDialogProps) => {
  const isEdit = !!user;
  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg overflow-hidden p-0 sm:p-0 [&>button:last-child]:hidden">
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy">
              Usuários
            </p>
            <DialogTitle className="mt-1">
              {isEdit ? "Editar usuário" : "Cadastrar usuário"}
            </DialogTitle>
            <DialogDescription className="mt-1">
              {isEdit
                ? "Altere os dados e permissões do usuário."
                : "Crie um acesso para um novo membro do escritório."}
            </DialogDescription>
          </div>
          <DialogClose className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-slate hover:bg-mist hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-navy">
            <X className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Fechar</span>
          </DialogClose>
        </div>

        {isEdit ? (
          <EditUserForm user={user} onDone={handleClose} />
        ) : (
          <CreateUserForm onDone={handleClose} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export { UserFormDialog };
