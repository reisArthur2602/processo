"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CaseFormDialog } from "./case-form-dialog";

interface NewCaseButtonProps {
  clientId: string;
  clientName: string;
}

const NewCaseButton = ({ clientId, clientName }: NewCaseButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" aria-hidden="true" />
        Cadastrar processo
      </Button>
      <CaseFormDialog
        clientId={clientId}
        clientName={clientName}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
};

export { NewCaseButton };
