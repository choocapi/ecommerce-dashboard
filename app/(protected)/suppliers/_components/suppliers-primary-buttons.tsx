import { Button } from "@/components/ui/button";
import { Feature } from "@/config/permissions-config";
import { usePermissions } from "@/hooks/use-permissions";
import { Plus } from "lucide-react";
import { useSuppliers } from "./suppliers-provider";

export function SuppliersPrimaryButtons() {
  const { setOpen } = useSuppliers();
  const { canCreate } = usePermissions();

  if (!canCreate(Feature.SUPPLIERS)) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen("create")}>
        <Plus size={18} />
        <span>Thêm nhà cung cấp</span>
      </Button>
    </div>
  );
}
