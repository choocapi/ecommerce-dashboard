import { OrdersDetailSheet } from "./orders-detail-sheet";
import { OrdersMutateDrawer } from "./orders-mutate-drawer";
import { useOrders } from "./orders-provider";

export function OrdersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useOrders();

  return (
    <>
      <OrdersMutateDrawer
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
