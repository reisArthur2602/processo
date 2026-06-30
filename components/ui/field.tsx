import {
  createContext,
  type HTMLAttributes,
  type LabelHTMLAttributes,
  useContext,
  useId,
} from "react";
import { cn } from "@/lib/utils";

type FieldContextValue = { id: string };

const FieldContext = createContext<FieldContextValue>({ id: "" });

const Field = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  const id = useId();
  return (
    <FieldContext.Provider value={{ id }}>
      <div className={cn("flex flex-col gap-1.5", className)} {...props}>
        {children}
      </div>
    </FieldContext.Provider>
  );
};

const FieldLabel = ({
  className,
  htmlFor,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) => {
  const { id } = useContext(FieldContext);
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: htmlFor is set dynamically via FieldContext
    <label
      htmlFor={htmlFor ?? id}
      className={cn("text-sm font-semibold text-ink", className)}
      {...props}
    />
  );
};

const FieldDescription = ({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-xs text-slate", className)} {...props} />
);

const FieldError = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => {
  if (!children) return null;
  return (
    <p
      role="alert"
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium text-danger",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-danger" />
      {children}
    </p>
  );
};

export { Field, FieldContext, FieldDescription, FieldError, FieldLabel };
