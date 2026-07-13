"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserFormDialog } from "./user-form-dialog";

const NewUserButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" aria-hidden="true" />
        Cadastrar usuário
      </Button>
      <UserFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
};

export { NewUserButton };
