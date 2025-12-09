import { Button } from "@/components/ui/button";
import { Feature } from "@/config/permissions-config";
import { usePermissions } from "@/hooks/use-permissions";
import { Plus } from "lucide-react";
import { useOrders } from "./orders-provider";

export function OrdersPrimaryButtons() {
  const { setOpen } = useOrders();
  const { canCreate } = usePermissions();

  if (!canCreate(Feature.ORDERS)) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen("create")}>
        <Plus size={18} />
        <span>Đơn hàng mới</span>
      </Button>
    </div>
  );
}
