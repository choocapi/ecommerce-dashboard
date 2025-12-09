import useDialogState from "@/hooks/use-dialog-state";
import type { ICoupon } from "@/types/coupon";
import React, { useState } from "react";

type CouponsDialogType = "create" | "update";

type CouponsContextType = {
  open: CouponsDialogType | null;
  setOpen: (str: CouponsDialogType | null) => void;
  currentRow: ICoupon | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<ICoupon | null>>;
};

const CouponsContext = React.createContext<CouponsContextType | null>(null);

export function CouponsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<CouponsDialogType>(null);
  const [currentRow, setCurrentRow] = useState<ICoupon | null>(null);

  return (
    <CouponsContext value={{ open, setOpen, currentRow, setCurrentRow }}>{children}</CouponsContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCoupons = () => {
  const couponsContext = React.useContext(CouponsContext);

  if (!couponsContext) {
    throw new Error("useCoupons has to be used within <CouponsContext>");
  }

  return couponsContext;
};

