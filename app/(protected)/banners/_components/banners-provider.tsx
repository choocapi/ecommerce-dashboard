import useDialogState from "@/hooks/use-dialog-state";
import type { IBanner } from "@/types/banner";
import React, { useState } from "react";

type BannersDialogType = "create" | "update";

type BannersContextType = {
  open: BannersDialogType | null;
  setOpen: (str: BannersDialogType | null) => void;
  currentRow: IBanner | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<IBanner | null>>;
};

const BannersContext = React.createContext<BannersContextType | null>(null);

export function BannersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<BannersDialogType>(null);
  const [currentRow, setCurrentRow] = useState<IBanner | null>(null);

  return (
    <BannersContext value={{ open, setOpen, currentRow, setCurrentRow }}>{children}</BannersContext>
  );
}

export const useBanners = () => {
  const bannersContext = React.useContext(BannersContext);

  if (!bannersContext) {
    throw new Error("useBanners has to be used within <BannersContext>");
  }

  return bannersContext;
};
