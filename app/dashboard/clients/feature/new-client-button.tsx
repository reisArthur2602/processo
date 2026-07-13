"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ClientFormDialog } from "./client-form-dialog";

const NewClientButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" aria-hidden="true" />
        Cadastrar cliente
      </Button>
      <ClientFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
};

export { NewClientButton };
