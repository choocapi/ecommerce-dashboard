import useDialogState from "@/hooks/use-dialog-state";
import type { IUser } from "@/types/user";
import React, { useState } from "react";

type StaffsDialogType = "create" | "update";

type StaffsContextType = {
  open: StaffsDialogType | null;
  setOpen: (str: StaffsDialogType | null) => void;
  currentRow: IUser | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<IUser | null>>;
};

const StaffsContext = React.createContext<StaffsContextType | null>(null);

export function StaffsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<StaffsDialogType>(null);
  const [currentRow, setCurrentRow] = useState<IUser | null>(null);

  return (
    <StaffsContext value={{ open, setOpen, currentRow, setCurrentRow }}>{children}</StaffsContext>
  );
}

export const useStaffs = () => {
  const staffsContext = React.useContext(StaffsContext);

  if (!staffsContext) {
    throw new Error("useStaffs has to be used within <StaffsContext>");
  }

  return staffsContext;
};
