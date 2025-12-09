import useDialogState from "@/hooks/use-dialog-state";
import type { IReturnRequest } from "@/types/return-request";
import React, { useState } from "react";

type ReturnRequestsDialogType = "update";

type ReturnRequestsContextType = {
  open: ReturnRequestsDialogType | null;
  setOpen: (str: ReturnRequestsDialogType | null) => void;
  currentRow: IReturnRequest | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<IReturnRequest | null>>;
};

const ReturnRequestsContext = React.createContext<ReturnRequestsContextType | null>(null);

export function ReturnRequestsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ReturnRequestsDialogType>(null);
  const [currentRow, setCurrentRow] = useState<IReturnRequest | null>(null);

  return (
    <ReturnRequestsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ReturnRequestsContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useReturnRequests = () => {
  const returnRequestsContext = React.useContext(ReturnRequestsContext);

  if (!returnRequestsContext) {
    throw new Error("useReturnRequests has to be used within <ReturnRequestsContext>");
  }

  return returnRequestsContext;
};
