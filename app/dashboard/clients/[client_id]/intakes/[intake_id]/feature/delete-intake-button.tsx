"use client";

import { Trash2, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteIntake } from "../actions/delete-intake";

interface DeleteIntakeButtonProps {
  clientId: string;
  intakeId: string;
  intakeNumber: string;
}

const DeleteIntakeButton = ({
  clientId,
  intakeId,
  intakeNumber,
}: DeleteIntakeButtonProps) => {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    const result = await deleteIntake(clientId, intakeId);
    if (result && !result.ok) {
      toast.error(result.message);
      setDeleting(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Trash2 className="h-4 w-4" />
        Excluir ficha
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-danger-soft text-danger">
            <TriangleAlert className="h-6 w-6" aria-hidden="true" />
          </div>
          <DialogTitle className="mt-4">
            Excluir ficha de atendimento?
          </DialogTitle>
          <DialogDescription className="mt-2">
            Esta ação não pode ser desfeita. A ficha{" "}
            <strong className="font-semibold text-ink">{intakeNumber}</strong>{" "}
            será permanentemente removida.
          </DialogDescription>
          <DialogFooter className="mt-6 gap-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              loading={deleting}
            >
              Confirmar exclusão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { DeleteIntakeButton };
