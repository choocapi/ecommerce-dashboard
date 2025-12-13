import { CategoriesDrawer } from "./categories-drawer";
import { useCategories } from "./categories-provider";

export function CategoriesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCategories();

  return (
    <>
      <CategoriesDrawer
        key="category-create"
        open={open === "create"}
        onOpenChange={() => setOpen("create")}
        currentCategory={null}
      />

      <CategoriesDrawer
        key={`category-update-${currentRow?.id}`}
        open={open === "update"}
        onOpenChange={() => {
          setOpen("update");
          setTimeout(() => {
            setCurrentRow(null);
          }, 500);
        }}
        currentCategory={currentRow}
      />
    </>
  );
}
