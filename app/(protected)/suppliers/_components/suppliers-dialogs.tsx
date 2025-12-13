import { SuppliersDrawer } from "./suppliers-drawer";
import { useSuppliers } from "./suppliers-provider";

export function SuppliersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useSuppliers();

  return (
    <>
      <SuppliersDrawer
        key="supplier-create"
        open={open === "create"}
        onOpenChange={() => setOpen("create")}
        currentSupplier={null}
      />

      <SuppliersDrawer
        key={`supplier-update-${currentRow?.id}`}
        open={open === "update"}
        onOpenChange={() => {
          setOpen("update");
          setTimeout(() => {
            setCurrentRow(null);
          }, 500);
        }}
        currentSupplier={currentRow}
      />
    </>
  );
}
