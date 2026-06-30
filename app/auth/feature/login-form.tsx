"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { login } from "@/app/auth/actions/login";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { type LoginInput, loginSchema } from "@/schema/login-schema";

const LoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const result = await login(data);
      if (result.ok) {
        toast.success(result.message);
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Não foi possível realizar o login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Username */}
      <Field>
        <FieldLabel>Usuário</FieldLabel>
        <Input
          id="username"
          placeholder="nome.sobrenome"
          type="text"
          autoComplete="username"
          status={errors.username ? "error" : "default"}
          {...register("username")}
        />
        {errors.username && <FieldError>{errors.username.message}</FieldError>}
      </Field>

      {/* Password */}
      <Field>
        <FieldLabel>Senha</FieldLabel>
        <div className="relative">
          <Input
            id="password"
            placeholder="Digite sua senha"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            status={errors.password ? "error" : "default"}
            rightIcon={
              <button
                type="button"
                className="text-slate hover:text-ink"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            }
            {...register("password")}
          />
        </div>
        {errors.password && <FieldError>{errors.password.message}</FieldError>}
      </Field>

      {/* Remember me */}
      <label
        htmlFor="remember-me"
        className="flex w-fit cursor-pointer items-center gap-3 text-sm text-slate"
      >
        <Checkbox {...register("rememberMe")} id="remember-me" />
        Manter acesso neste dispositivo
      </label>

      {/* Submit */}
      <Button type="submit" className="w-full" loading={isLoading}>
        Entrar na plataforma
      </Button>

      {/* Terms */}
      <p className="text-center text-xs leading-5 text-slate">
        Ao entrar, você concorda com as políticas internas de segurança do
        escritório.
      </p>
    </form>
  );
};

export { LoginForm };
