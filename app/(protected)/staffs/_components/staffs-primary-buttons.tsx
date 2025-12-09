import { Button } from "@/components/ui/button";
import { Feature } from "@/config/permissions-config";
import { usePermissions } from "@/hooks/use-permissions";
import { Plus } from "lucide-react";
import { useStaffs } from "./staffs-provider";

export function StaffsPrimaryButtons() {
  const { setOpen } = useStaffs();
  const { canCreate } = usePermissions();

  if (!canCreate(Feature.STAFFS)) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen("create")}>
        <Plus size={18} />
        <span>Thêm nhân viên</span>
      </Button>
    </div>
  );
}
