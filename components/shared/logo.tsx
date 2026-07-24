import { cn } from "@/lib/utils";

interface LogoProps {
  /** "dark" = logo sobre fundo escuro (texto claro); "light" = sobre fundo claro (texto escuro) */
  variant?: "dark" | "light";
  /** "sm" = wordmark 2xl; "md" = wordmark 4xl */
  size?: "sm" | "md";
  showTagline?: boolean;
  className?: string;
}

const titleSizes = { sm: "text-2xl", md: "text-4xl" };
const taglineSizes = { sm: "text-[9px]", md: "text-[10px]" };

const Logo = ({
  variant = "dark",
  size = "sm",
  showTagline = true,
  className,
}: LogoProps) => {
  const titleColor = variant === "dark" ? "text-white" : "text-ink";
  const taglineColor = variant === "dark" ? "text-white/55" : "text-slate";

  return (
    <span className={cn("inline-flex flex-col", className)}>
      <span
        className={cn(
          "font-display font-bold leading-none tracking-[-0.02em]",
          titleSizes[size],
          titleColor,
        )}
      >
        <span className="text-docket">M</span>onteiro
      </span>

      {showTagline && (
        <span className="mt-2 flex items-center gap-2">
          <span
            className="h-px w-5 shrink-0 bg-docket"
            aria-hidden="true"
          />
          <span
            className={cn(
              "font-semibold uppercase tracking-[0.28em]",
              taglineSizes[size],
              taglineColor,
            )}
          >
            Sociedade de Advogados
          </span>
        </span>
      )}
    </span>
  );
};

export { Logo };
