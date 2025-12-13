import { OrdersDetailSheet } from "./orders-detail-sheet";
import { OrdersDrawer } from "./orders-drawer";
import { useOrders } from "./orders-provider";

export function OrdersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useOrders();

  return (
    <>
      <OrdersDrawer
        key="order-create"
        open={open === "create"}
        onOpenChange={() => setOpen("create")}
      />

      <OrdersDetailSheet
        key="order-detail"
        open={open === "detail"}
        onOpenChange={() => {
          setOpen("detail");
          setTimeout(() => {
            setCurrentRow(null);
          }, 500);
        }}
        order={currentRow}
      />
    </>
  );
}
