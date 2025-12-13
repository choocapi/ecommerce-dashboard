import useDialogState from "@/hooks/use-dialog-state";
import { type IOrder } from "@/types/order";
import React, { useState } from "react";

type OrdersDialogType = "create" | "detail";

type OrdersContextType = {
  open: OrdersDialogType | null;
  setOpen: (str: OrdersDialogType | null) => void;
  currentRow: IOrder | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<IOrder | null>>;
};

const OrdersContext = React.createContext<OrdersContextType | null>(null);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<OrdersDialogType>(null);
  const [currentRow, setCurrentRow] = useState<IOrder | null>(null);

  return (
    <OrdersContext value={{ open, setOpen, currentRow, setCurrentRow }}>{children}</OrdersContext>
  );
}

export const useOrders = () => {
  const ordersContext = React.useContext(OrdersContext);

  if (!ordersContext) {
    throw new Error("useOrders has to be used within <OrdersContext>");
  }

  return ordersContext;
};
