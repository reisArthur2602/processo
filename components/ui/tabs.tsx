"use client";

import {
  type ButtonHTMLAttributes,
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useState,
} from "react";
import { cn } from "@/lib/utils";

type TabsContextValue = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue>({
  value: "",
  onValueChange: () => {},
});

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: ReactNode;
}

const Tabs = ({
  defaultValue = "",
  value: controlledValue,
  onValueChange: controlledOnChange,
  className,
  children,
}: TabsProps) => {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? (controlledValue ?? "") : uncontrolled;

  const onValueChange = (next: string) => {
    if (!isControlled) setUncontrolled(next);
    controlledOnChange?.(next);
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    role="tablist"
    className={cn("flex overflow-x-auto border-b border-line", className)}
    {...props}
  />
);

interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  count?: number;
}

const TabsTrigger = ({
  className,
  value,
  count,
  children,
  ...props
}: TabsTriggerProps) => {
  const { value: activeValue, onValueChange } = useContext(TabsContext);
  const isActive = value === activeValue;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      id={`tab-${value}`}
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-navy",
        isActive
          ? "border-navy text-navy"
          : "border-transparent text-slate hover:text-ink",
        className,
      )}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
      {count !== undefined && (
        <span
          className={cn(
            "ml-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold",
            isActive ? "bg-navy-soft text-navy" : "bg-mist text-slate",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
};

interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = ({ className, value, ...props }: TabsContentProps) => {
  const { value: activeValue } = useContext(TabsContext);
  if (value !== activeValue) return null;
  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      className={cn("mt-4", className)}
      {...props}
    />
  );
};

export { Tabs, TabsContent, TabsList, TabsTrigger };
