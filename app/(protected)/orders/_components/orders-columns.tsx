import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Feature } from "@/config/permissions-config";
import { useFeaturePermissions } from "@/hooks/use-feature-permissions";
import { orderService } from "@/services/orderService";
import { OrderStatusEnum } from "@/types/enums";
import { IOrder, getOrderStatusLabel, getPaymentMethodLabel } from "@/types/order";
import { formatDateTime, formatUuid } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import { useOrders } from "./orders-provider";

function ActionGroup({ order }: { order: IOrder }) {
  const { setOpen, setCurrentRow } = useOrders();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        setCurrentRow(order);
        setOpen("detail");
      }}
      className="h-8 w-8 p-0"
    >
      <Eye className="h-4 w-4" />
      <span className="sr-only">Xem chi tiết</span>
    </Button>
  );
}

// Status Cell Component with permission check
function StatusCell({ order }: { order: IOrder }) {
  const queryClient = useQueryClient();
  const currentStatus = order.status;
  const { canUpdate } = useFeaturePermissions(Feature.ORDERS);

  const statusOptions = Object.values(OrderStatusEnum).map((status: any) => ({
    label: getOrderStatusLabel(status),
    value: status,
    disabled: ![
      OrderStatusEnum.PROCESSING,
      OrderStatusEnum.SHIPPED,
      OrderStatusEnum.CANCELLED,
    ].includes(status),
  }));

  const handleStatusChange = async (newStatus: string) => {
    try {
      // Only allow updating to PROCESSING, SHIPPED, or CANCELLED
      if (
        newStatus !== OrderStatusEnum.PROCESSING &&
        newStatus !== OrderStatusEnum.SHIPPED &&
        newStatus !== OrderStatusEnum.CANCELLED
      ) {
        toast.error("Chỉ có thể cập nhật trạng thái thành 'Đang xử lý', 'Đang giao' hoặc 'Đã hủy'");
        return;
      }

      // Call service method
      let result: IOrder;
      switch (newStatus) {
        case OrderStatusEnum.PROCESSING:
          result = await orderService.confirm(order.id);
          break;
        case OrderStatusEnum.SHIPPED:
          result = await orderService.ship(order.id);
          break;
        case OrderStatusEnum.CANCELLED:
          result = await orderService.cancel(order.id);
          break;
      }

      toast.success("Order status updated successfully");

      // Invalidate and refetch orders data
      await queryClient.invalidateQueries({
        queryKey: ["orders", "list"],
      });
    } catch (error) {
      toast.error("Failed to update order status");
      console.error("Error updating order status:", error);
    }
  };

  // If user doesn't have UPDATE permission, show read-only badge
  if (!canUpdate) {
    return <Badge variant="outline">{getOrderStatusLabel(currentStatus)}</Badge>;
  }

  return (
    <Select value={currentStatus} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export const ordersColumns: ColumnDef<IOrder>[] = [
  {
    accessorKey: "id",
    header: "Mã đơn hàng",
    cell: ({ row }) => <div className="font-medium">{formatUuid(row.getValue("id"))}</div>,
  },
  {
    accessorKey: "user",
    header: "Khách hàng",
    cell: ({ row }) => {
      const user = row.getValue("user") as IOrder["user"];
      return (
        <div>
          {user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.email || "—"}
        </div>
      );
    },
  },
  {
    accessorKey: "shippingName",
    header: "Người nhận",
    cell: ({ row }) => <div>{row.getValue("shippingName") || "—"}</div>,
  },
  {
    accessorKey: "totalAmount",
    header: "Tổng tiền",
    cell: ({ row }) => {
      const amount = row.getValue("totalAmount") as number;
      return (
        <div className="font-medium">
          {amount?.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }) || "—"}
        </div>
      );
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Thanh toán",
    cell: ({ row }) => {
      const method = row.getValue("paymentMethod") as string;
      return <div>{getPaymentMethodLabel(method) || "—"}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => <StatusCell order={row.original} />,
  },
  {
    accessorKey: "orderedAt",
    header: "Ngày đặt hàng",
    cell: ({ row }) => {
      const date = row.getValue("orderedAt") as string;
      return <div>{formatDateTime(date)}</div>;
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => <ActionGroup order={row.original} />,
  },
];
