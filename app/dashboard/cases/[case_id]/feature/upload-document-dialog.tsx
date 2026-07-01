"use client";

import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { uploadDocument } from "../actions/upload-document";

interface UploadDocumentDialogProps {
  caseId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UploadDocumentDialog = ({
  caseId,
  open,
  onOpenChange,
}: UploadDocumentDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    if (uploading) return;
    setFile(null);
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const removeFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadDocument(caseId, formData);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      removeFile();
      onOpenChange(false);
    } catch {
      toast.error("Não foi possível anexar o documento. Tente novamente.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg overflow-hidden p-0 sm:p-0 [&>button:last-child]:hidden">
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy">
              Documentos
            </p>
            <DialogTitle className="mt-1">Anexar documento</DialogTitle>
            <DialogDescription className="mt-1">
              O arquivo será salvo no servidor e vinculado a este processo.
            </DialogDescription>
          </div>
          <DialogClose className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-slate hover:bg-mist hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-navy">
            <X className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Fechar</span>
          </DialogClose>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6">
          <input
            ref={inputRef}
            type="file"
            aria-label="Selecionar arquivo"
            className="sr-only"
            onChange={handleFileChange}
          />

          {!file ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex w-full flex-col items-center gap-3 rounded-xl border-2 border-dashed border-line bg-mist/60 px-6 py-10 text-center transition hover:border-navy hover:bg-navy-soft/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-white text-navy shadow-sm">
                <Upload className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">
                  Clique para selecionar
                </p>
                <p className="mt-1 text-xs text-slate">
                  PDF, Word, Excel, imagens — máx. 50 MB
                </p>
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-4 rounded-xl border border-line bg-mist/60 p-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-soft text-navy">
                <Upload className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">
                  {file.name}
                </p>
                <p className="text-xs text-slate">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={removeFile}
                aria-label="Remover arquivo"
                className="rounded-lg p-1.5 text-slate hover:bg-line hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={uploading}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={uploading} disabled={!file}>
              <Upload className="h-4 w-4" />
              Anexar documento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { UploadDocumentDialog };
