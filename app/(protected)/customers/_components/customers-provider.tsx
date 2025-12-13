import useDialogState from "@/hooks/use-dialog-state";
import type { IUser } from "@/types/user";
import React, { useState } from "react";

type CustomersDialogType = "update";

type CustomersContextType = {
  open: CustomersDialogType | null;
  setOpen: (str: CustomersDialogType | null) => void;
  currentRow: IUser | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<IUser | null>>;
};

const CustomersContext = React.createContext<CustomersContextType | null>(null);

export function CustomersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<CustomersDialogType>(null);
  const [currentRow, setCurrentRow] = useState<IUser | null>(null);

  return (
    <CustomersContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CustomersContext>
  );
}

export const useCustomers = () => {
  const customersContext = React.useContext(CustomersContext);

  if (!customersContext) {
    throw new Error("useCustomers has to be used within <CustomersContext>");
  }

  return customersContext;
};
