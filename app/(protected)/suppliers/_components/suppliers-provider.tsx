import useDialogState from "@/hooks/use-dialog-state";
import type { ISupplier } from "@/types/supplier";
import React, { useState } from "react";

type SuppliersDialogType = "create" | "update";

type SuppliersContextType = {
  open: SuppliersDialogType | null;
  setOpen: (str: SuppliersDialogType | null) => void;
  currentRow: ISupplier | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<ISupplier | null>>;
};

const SuppliersContext = React.createContext<SuppliersContextType | null>(null);

export function SuppliersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<SuppliersDialogType>(null);
  const [currentRow, setCurrentRow] = useState<ISupplier | null>(null);

  return (
    <SuppliersContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </SuppliersContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSuppliers = () => {
  const suppliersContext = React.useContext(SuppliersContext);

  if (!suppliersContext) {
    throw new Error("useSuppliers has to be used within <SuppliersContext>");
  }

  return suppliersContext;
};
