import { CustomersDrawer } from "./customers-drawer";
import { useCustomers } from "./customers-provider";

export function CustomersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCustomers();

  return (
    <CustomersDrawer
      key={`customer-update-${currentRow?.id}`}
      open={open === "update"}
      onOpenChange={() => {
        setOpen("update");
        setTimeout(() => {
          setCurrentRow(null);
        }, 500);
      }}
      currentCustomer={currentRow}
    />
  );
}
