import useDialogState from "@/hooks/use-dialog-state";
import { type IProduct } from "@/types/products";
import React, { useState } from "react";

type ProductsDialogType = "create" | "update";

type ProductsContextType = {
  open: ProductsDialogType | null;
  setOpen: (str: ProductsDialogType | null) => void;
  currentRow: IProduct | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<IProduct | null>>;
};

const ProductsContext = React.createContext<ProductsContextType | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ProductsDialogType>(null);
  const [currentRow, setCurrentRow] = useState<IProduct | null>(null);

  return (
    <ProductsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ProductsContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProducts = () => {
  const productsContext = React.useContext(ProductsContext);

  if (!productsContext) {
    throw new Error("useProducts has to be used within <ProductsContext>");
  }

  return productsContext;
};
