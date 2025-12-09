import { Button } from "@/components/ui/button";
import { Feature } from "@/config/permissions-config";
import { usePermissions } from "@/hooks/use-permissions";
import { Plus } from "lucide-react";
import { useCategories } from "./categories-provider";

export function CategoriesPrimaryButtons() {
  const { setOpen } = useCategories();
  const { canCreate } = usePermissions();

  if (!canCreate(Feature.CATEGORIES)) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen("create")}>
        <Plus size={18} />
        <span>Thêm danh mục</span>
      </Button>
    </div>
  );
}
