import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Feature } from "@/config/permissions-config";
import { useFeaturePermissions } from "@/hooks/use-feature-permissions";
import { userService } from "@/services/userService";
import { RolesEnum } from "@/types/enums";
import { IUser } from "@/types/user";
import { formatUuid } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Mail, Pencil, Phone, Shield, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { useStaffs } from "./staffs-provider";

// Actions Cell Component with Confirm Dialog
function ActionsCell({ staff }: { staff: IUser }) {
  const { setOpen, setCurrentRow } = useStaffs();
  const queryClient = useQueryClient();
  const { canUpdate, canDelete } = useFeaturePermissions(Feature.STAFFS);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await userService.delete(staff.id);
      toast.success("Đã xóa nhân viên thành công");

      // Invalidate and refetch staffs data
      await queryClient.invalidateQueries({
        queryKey: ["staffs", "list"],
      });
    } catch (error: any) {
      toast.error(error?.message || "Không thể xóa nhân viên");
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
    }
  };

  // Don't show actions if user has no permissions
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
              setCurrentRow(staff);
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
        title="Xóa nhân viên"
        desc={`Bạn có chắc muốn xóa nhân viên "${staff.firstName} ${staff.lastName}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        destructive
        handleConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  );
}

export const staffsColumns: ColumnDef<IUser>[] = [
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
    accessorKey: "roles",
    header: "Vai trò",
    cell: ({ row }) => {
      const roles = row.original.roles || [];
      return (
        <div className="flex flex-wrap gap-1">
          {roles.map((role, index) => (
            <Badge
              key={`${role.name}-${index}`}
              variant={role.name === RolesEnum.ADMIN ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              <Shield size={10} />
              {role.name}
            </Badge>
          ))}
          {roles.length === 0 && <span className="text-gray-400">—</span>}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const roles = row.original.roles || [];
      return roles.some((role) => value.includes(role.name));
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
    cell: ({ row }) => <ActionsCell staff={row.original} />,
    enableSorting: false,
  },
];
