import { Button } from "@/components/ui/button";
import { Feature } from "@/config/permissions-config";
import { usePermissions } from "@/hooks/use-permissions";
import { Plus } from "lucide-react";
import { useCoupons } from "./coupons-provider";

export function CouponsPrimaryButtons() {
  const { setOpen } = useCoupons();
  const { canCreate } = usePermissions();

  if (!canCreate(Feature.COUPONS)) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen("create")}>
        <Plus size={18} />
        <span>Thêm mã giảm giá</span>
      </Button>
    </div>
  );
}

