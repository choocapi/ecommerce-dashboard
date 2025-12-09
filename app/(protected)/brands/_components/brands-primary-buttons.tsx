import { Button } from "@/components/ui/button";
import { Feature } from "@/config/permissions-config";
import { usePermissions } from "@/hooks/use-permissions";
import { Plus } from "lucide-react";
import { useBrands } from "./brands-provider";

export function BrandsPrimaryButtons() {
  const { setOpen } = useBrands();
  const { canCreate } = usePermissions();

  if (!canCreate(Feature.BRANDS)) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen("create")}>
        <Plus size={18} />
        <span>Thêm thương hiệu</span>
      </Button>
    </div>
  );
}
