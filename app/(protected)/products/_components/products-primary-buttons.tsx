import { Button } from "@/components/ui/button";
import { Feature } from "@/config/permissions-config";
import { usePermissions } from "@/hooks/use-permissions";
import { Plus } from "lucide-react";
import { useProducts } from "./products-provider";

export function ProductsPrimaryButtons() {
  const { setOpen } = useProducts();
  const { canCreate } = usePermissions();

  if (!canCreate(Feature.PRODUCTS)) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen("create")}>
        <Plus size={18} />
        <span>Thêm sản phẩm</span>
      </Button>
    </div>
  );
}
