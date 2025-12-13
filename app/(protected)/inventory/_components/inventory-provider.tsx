import useDialogState from "@/hooks/use-dialog-state";
import type { IProduct } from "@/types/products";
import React, { useState } from "react";

type InventoryDialogType = "create";

type InventoryContextType = {
  open: InventoryDialogType | null;
  setOpen: (str: InventoryDialogType | null) => void;
  currentRow: IProduct | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<IProduct | null>>;
};

const InventoryContext = React.createContext<InventoryContextType | null>(null);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<InventoryDialogType>(null);
  const [currentRow, setCurrentRow] = useState<IProduct | null>(null);

  return (
    <InventoryContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </InventoryContext>
  );
}

export const useInventory = () => {
  const inventoryContext = React.useContext(InventoryContext);

  if (!inventoryContext) {
    throw new Error("useInventory has to be used within <InventoryContext>");
  }

  return inventoryContext;
};
