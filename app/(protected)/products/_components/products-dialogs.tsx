import { ProductsDrawer } from "./products-drawer";
import { useProducts } from "./products-provider";

export function ProductsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useProducts();

  return (
    <>
      <ProductsDrawer
        key="product-create"
        open={open === "create"}
        onOpenChange={() => setOpen("create")}
        currentProduct={null}
      />

      <ProductsDrawer
        key={`product-update-${currentRow?.id}`}
        open={open === "update"}
        onOpenChange={() => {
          setOpen("update");
          setTimeout(() => {
            setCurrentRow(null);
          }, 500);
        }}
        currentProduct={currentRow}
      />
    </>
  );
}
