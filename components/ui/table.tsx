import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Table = ({ className, ...props }: HTMLAttributes<HTMLTableElement>) => (
  <div className="w-full overflow-x-auto">
    <table
      className={cn(
        "w-full min-w-[640px] border-collapse text-left",
        className,
      )}
      {...props}
    />
  </div>
);

const TableHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) => (
  <thead
    className={cn(
      "bg-mist text-[11px] font-bold uppercase tracking-[0.12em] text-slate",
      className,
    )}
    {...props}
  />
);

const TableBody = ({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn("divide-y divide-line text-sm", className)} {...props} />
);

const TableRow = ({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    className={cn("transition hover:bg-navy-soft/40", className)}
    {...props}
  />
);

const TableHead = ({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className={cn("px-6 py-4 font-bold", className)} {...props} />
);

const TableCell = ({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn("px-6 py-5", className)} {...props} />
);

const TableCaption = ({
  className,
  ...props
}: HTMLAttributes<HTMLTableCaptionElement>) => (
  <caption
    className={cn(
      "border-t border-line px-5 py-4 text-left text-xs text-slate",
      className,
    )}
    {...props}
  />
);

const TableEmpty = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <tr>
    <td colSpan={999}>
      <div className={cn("px-6 py-16 text-center", className)}>{children}</div>
    </td>
  </tr>
);

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
};
