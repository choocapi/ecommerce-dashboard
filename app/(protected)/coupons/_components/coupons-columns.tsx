import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Feature } from "@/config/permissions-config";
import { useFeaturePermissions } from "@/hooks/use-feature-permissions";
import { couponService } from "@/services/couponService";
import { ICoupon } from "@/types/coupon";
import { CouponTypeEnum } from "@/types/enums";
import { formatNumberId } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Percent, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCoupons } from "./coupons-provider";

function ActionGroup({ coupon }: { coupon: ICoupon }) {
  const { setOpen, setCurrentRow } = useCoupons();
  const queryClient = useQueryClient();
  const { canUpdate, canDelete } = useFeaturePermissions(Feature.COUPONS);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await couponService.delete(coupon.id);
      toast.success("Đã xóa mã giảm giá thành công");

      // Invalidate and refetch coupons data
      await queryClient.invalidateQueries({
        queryKey: ["coupons", "list"],
      });
    } catch (error: any) {
      toast.error(error?.message || "Không thể xóa mã giảm giá");
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (!canUpdate && !canDelete) {
    return <div className="text-muted-foreground text-sm">Cần quyền</div>;
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {canUpdate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCurrentRow(coupon);
              setOpen("update");
            }}
            className="h-8 w-8 p-0"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Sửa</span>
          </Button>
        )}
        {canDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmOpen(true)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Xóa</span>
          </Button>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Xóa mã giảm giá"
        desc={`Bạn có chắc muốn xóa mã giảm giá "${coupon.code}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        destructive
        handleConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  );
}

export const couponsColumns: ColumnDef<ICoupon>[] = [
  {
    accessorKey: "id",
    header: "Mã",
    cell: ({ row }) => <div className="font-medium">{formatNumberId(row.getValue("id"))}</div>,
  },
  {
    accessorKey: "code",
    header: "Mã giảm giá",
    cell: ({ row }) => {
      const code = row.getValue("code") as string;
      return <div className="font-mono font-medium">{code}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-[250px] truncate" title={description}>
          {description || "—"}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Loại",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <Badge
          variant={type === CouponTypeEnum.FIXED ? "default" : "secondary"}
          className="flex items-center gap-1"
        >
          {type === CouponTypeEnum.PERCENTAGE && <Percent size={12} />}
          {type === CouponTypeEnum.FIXED ? "Cố định" : "Phần trăm"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "value",
    header: "Giá trị",
    cell: ({ row }) => {
      const value = row.getValue("value") as number;
      const type = row.original.type;
      return (
        <div className="font-medium">
          {type === CouponTypeEnum.FIXED
            ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
            : `${value}%`}
        </div>
      );
    },
  },
  {
    accessorKey: "usageLimit",
    header: "Giới hạn sử dụng",
    cell: ({ row }) => {
      const usageLimit = row.getValue("usageLimit") as number;
      return <div>{usageLimit || "Không giới hạn"}</div>;
    },
  },
  {
    accessorKey: "usedCount",
    header: "Đã sử dụng",
    cell: ({ row }) => {
      const usedCount = row.getValue("usedCount") as number;
      return <div>{usedCount || 0}</div>;
    },
  },
  {
    accessorKey: "startDate",
    header: "Ngày bắt đầu",
    cell: ({ row }) => {
      const startDate = row.getValue("startDate") as string;
      return startDate ? new Date(startDate).toLocaleDateString("vi-VN") : "—";
    },
  },
  {
    accessorKey: "endDate",
    header: "Ngày kết thúc",
    cell: ({ row }) => {
      const endDate = row.getValue("endDate") as string;
      return endDate ? new Date(endDate).toLocaleDateString("vi-VN") : "—";
    },
  },
  {
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Hoạt động" : "Không hoạt động"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => <ActionGroup coupon={row.original} />,
    enableSorting: false,
  },
];
