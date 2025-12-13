import { InventoryDrawer } from "./inventory-drawer";
import { useInventory } from "./inventory-provider";

export function InventoryDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useInventory();

  return (
    <>
      <InventoryDrawer
        key={`inventory-create-${currentRow?.id || "new"}`}
        open={open === "create"}
        onOpenChange={(open) => {
          if (!open) {
            setOpen(null);
            setTimeout(() => {
              setCurrentRow(null);
            }, 500);
          }
        }}
        currentProduct={currentRow}
      />

      <InventoryDrawer
        key={`inventory-update-${currentRow?.id}`}
        open={open === "update"}
        onOpenChange={(open) => {
          if (!open) {
            setOpen(null);
            setTimeout(() => {
              setCurrentRow(null);
            }, 500);
          }
        }}
        currentProduct={currentRow}
      />
    </>
  );
}
