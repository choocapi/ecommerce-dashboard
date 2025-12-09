import { CategoriesMutateDrawer } from "./categories-mutate-drawer";
import { useCategories } from "./categories-provider";

export function CategoriesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCategories();

  return (
    <>
      <CategoriesMutateDrawer
        key="category-create"
        open={open === "create"}
        onOpenChange={() => setOpen("create")}
        currentCategory={null}
      />

      <CategoriesMutateDrawer
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
