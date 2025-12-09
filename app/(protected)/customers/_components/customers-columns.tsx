import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Feature } from "@/config/permissions-config";
import { useFeaturePermissions } from "@/hooks/use-feature-permissions";
import { IUser } from "@/types/user";
import { formatUuid } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Mail, Pencil, Phone } from "lucide-react";
import Image from "next/image";
import { useCustomers } from "./customers-provider";

// Actions Cell Component (only edit)
function ActionsCell({ customer }: { customer: IUser }) {
  const { setOpen, setCurrentRow } = useCustomers();
  const { canUpdate } = useFeaturePermissions(Feature.CUSTOMERS);

  if (!canUpdate) {
    return <div className="text-muted-foreground text-sm">Cần quyền</div>;
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setCurrentRow(customer);
          setOpen("update");
        }}
        className="h-8 w-8 p-0"
      >
        <Pencil className="h-4 w-4" />
        <span className="sr-only">Sửa</span>
      </Button>
    </div>
  );
}

export const customersColumns: ColumnDef<IUser>[] = [
  {
    accessorKey: "id",
    header: "Mã",
    cell: ({ row }) => <div className="font-medium">{formatUuid(row.getValue("id"))}</div>,
  },
  {
    accessorKey: "avatarUrl",
    header: "Avatar",
    cell: ({ row }) => {
      const avatarUrl = row.getValue("avatarUrl") as string;
      const firstName = row.original.firstName || "";
      const lastName = row.original.lastName || "";
      const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

      return avatarUrl ? (
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200">
          <Image src={avatarUrl} alt={`${firstName} ${lastName}`} fill className="object-cover" />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-600">{initials || "?"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "firstName",
    header: "Tên",
    cell: ({ row }) => {
      const firstName = row.getValue("firstName") as string;
      const lastName = row.original.lastName || "";
      const fullName = `${firstName || ""} ${lastName}`.trim();
      return (
        <div className="max-w-[150px] truncate" title={fullName}>
          {fullName || "—"}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return (
        <div className="flex items-center gap-2">
          <Mail size={14} className="text-gray-400" />
          <span className="max-w-[200px] truncate" title={email}>
            {email}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Số điện thoại",
    cell: ({ row }) => {
      const phoneNumber = row.getValue("phoneNumber") as string;
      return phoneNumber ? (
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-gray-400" />
          <span>{phoneNumber}</span>
        </div>
      ) : (
        <span className="text-gray-400">—</span>
      );
    },
  },
  {
    accessorKey: "emailVerified",
    header: "Xác thực",
    cell: ({ row }) => {
      const emailVerified = row.getValue("emailVerified") as boolean;
      return (
        <Badge variant={emailVerified ? "default" : "secondary"}>
          {emailVerified ? "Đã xác thực" : "Chưa xác thực"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value === row.getValue(id);
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
      return value === row.getValue(id);
    },
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      return createdAt ? new Date(createdAt).toLocaleDateString("vi-VN") : "—";
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => <ActionsCell customer={row.original} />,
    enableSorting: false,
  },
];
