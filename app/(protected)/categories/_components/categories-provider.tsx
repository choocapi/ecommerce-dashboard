import useDialogState from "@/hooks/use-dialog-state";
import type { ICategory } from "@/types/products";
import React, { useState } from "react";

type CategoriesDialogType = "create" | "update";

type CategoriesContextType = {
  open: CategoriesDialogType | null;
  setOpen: (str: CategoriesDialogType | null) => void;
  currentRow: ICategory | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<ICategory | null>>;
};

const CategoriesContext = React.createContext<CategoriesContextType | null>(null);

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<CategoriesDialogType>(null);
  const [currentRow, setCurrentRow] = useState<ICategory | null>(null);

  return (
    <CategoriesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CategoriesContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCategories = () => {
  const categoriesContext = React.useContext(CategoriesContext);

  if (!categoriesContext) {
    throw new Error("useCategories has to be used within <CategoriesContext>");
  }

  return categoriesContext;
};
