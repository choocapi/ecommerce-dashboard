import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Feature } from "@/config/permissions-config";
import { useFeaturePermissions } from "@/hooks/use-feature-permissions";
import { ReturnStatus } from "@/types/enums";
import { IReturnRequest, RETURN_STATUS_LABELS, getReturnStatusColor } from "@/types/return-request";
import { formatNumberId, formatUuid, getUserFullName } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { useReturnRequests } from "./return-requests-provider";

// Actions Cell Component with only Edit button
function ActionsCell({ returnRequest }: { returnRequest: IReturnRequest }) {
  const { setOpen, setCurrentRow } = useReturnRequests();
  const { canUpdate } = useFeaturePermissions(Feature.RETURN_REQUESTS);

  if (!canUpdate) {
    return <div className="text-muted-foreground text-sm">Cần quyền</div>;
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setCurrentRow(returnRequest);
          setOpen("update");
        }}
        className="h-8 w-8 p-0"
      >
        <Pencil className="h-4 w-4" />
        <span className="sr-only">Cập nhật trạng thái</span>
      </Button>
    </div>
  );
}

export const returnRequestsColumns: ColumnDef<IReturnRequest>[] = [
  {
    accessorKey: "id",
    header: "Mã",
    cell: ({ row }) => <div className="font-medium">{formatNumberId(row.getValue("id"))}</div>,
  },
  {
    accessorKey: "orderId",
    header: "Mã đơn hàng",
    cell: ({ row }) => <div className="font-medium">{formatUuid(row.getValue("orderId"))}</div>,
  },
  {
    accessorKey: "user",
    header: "Khách hàng",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="max-w-[150px] truncate" title={getUserFullName(user)}>
          {getUserFullName(user) || "—"}
        </div>
      );
    },
  },
  {
    accessorKey: "reason",
    header: "Lý do",
    cell: ({ row }) => {
      const reason = row.getValue("reason") as string;
      return (
        <div className="max-w-[200px] truncate" title={reason}>
          {reason}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as ReturnStatus;
      const statusLabel = RETURN_STATUS_LABELS[status] || status;

      return (
        <Badge variant="outline" className={getReturnStatusColor(status)}>
          {statusLabel}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "imageUrls",
    header: "Ảnh",
    cell: ({ row }) => {
      const imageUrls = row.getValue("imageUrls") as string;
      if (!imageUrls) return <span className="text-muted-foreground">—</span>;

      try {
        const urls = JSON.parse(imageUrls) as string[];
        if (urls.length === 0) return <span className="text-muted-foreground">—</span>;

        return (
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10 rounded overflow-hidden border">
              <Image src={urls[0]} alt="Return image" fill className="object-cover" />
            </div>
            {urls.length > 1 && (
              <span className="text-xs text-muted-foreground">+{urls.length - 1}</span>
            )}
          </div>
        );
      } catch {
        return <span className="text-muted-foreground">—</span>;
      }
    },
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return <div className="text-sm">{new Date(date).toLocaleDateString("vi-VN")}</div>;
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => <ActionsCell returnRequest={row.original} />,
    enableSorting: false,
  },
];
