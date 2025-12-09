import useDialogState from "@/hooks/use-dialog-state";
import type { IBrand } from "@/types/products";
import React, { useState } from "react";

type BrandsDialogType = "create" | "update";

type BrandsContextType = {
  open: BrandsDialogType | null;
  setOpen: (str: BrandsDialogType | null) => void;
  currentRow: IBrand | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<IBrand | null>>;
};

const BrandsContext = React.createContext<BrandsContextType | null>(null);

export function BrandsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<BrandsDialogType>(null);
  const [currentRow, setCurrentRow] = useState<IBrand | null>(null);

  return (
    <BrandsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </BrandsContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useBrands = () => {
  const brandsContext = React.useContext(BrandsContext);

  if (!brandsContext) {
    throw new Error("useBrands has to be used within <BrandsContext>");
  }

  return brandsContext;
};
