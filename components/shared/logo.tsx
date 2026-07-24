import { cn } from "@/lib/utils";

interface LogoProps {
  /** "dark" = logo sobre fundo escuro (ícone branco); "light" = logo sobre fundo claro (ícone escuro) */
  variant?: "dark" | "light";
  /** "sm" = ícone 40px, título xl; "md" = ícone 44px, título 2xl */
  size?: "sm" | "md";
  showTagline?: boolean;
  className?: string;
}

const iconSizes = { sm: "h-10 w-10", md: "h-11 w-11" };
const titleSizes = { sm: "text-xl", md: "text-2xl" };

const Logo = ({
  variant = "dark",
  size = "sm",
  showTagline = true,
  className,
}: LogoProps) => {
  const iconBg =
    variant === "dark" ? "bg-white text-ink" : "bg-ink text-white";
  const titleColor = variant === "dark" ? "text-white" : "text-ink";
  const taglineColor =
    variant === "dark" ? "text-white/50" : "text-slate";

  return (
    <span className={cn("flex items-center gap-3", className)}>
      <span
        className={cn(
          "grid shrink-0 place-items-center rounded-xl",
          iconSizes[size],
          iconBg,
          size === "md" && "shadow-lift",
        )}
        aria-hidden="true"
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M12 2v6m0 0l-4 2.5m4-2.5l4 2.5M8 8l-3.5 8.5h11l-3.5-8.5m-4 8.5h4m-6 0h8v2h-8z" />
        </svg>
      </span>

      <span>
        <span
          className={cn(
            "block font-display font-bold leading-none",
            titleSizes[size],
            titleColor,
          )}
        >
          Monteiro
        </span>
        {showTagline && (
          <span
            className={cn(
              "mt-1 block text-[9px] font-semibold uppercase tracking-[0.24em]",
              taglineColor,
            )}
          >
            Sociedade de Advogados
          </span>
        )}
      </span>
    </span>
  );
};

export { Logo };
