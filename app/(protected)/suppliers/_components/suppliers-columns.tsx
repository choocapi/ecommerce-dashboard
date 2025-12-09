import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Feature } from "@/config/permissions-config";
import { useFeaturePermissions } from "@/hooks/use-feature-permissions";
import { supplierService } from "@/services/supplierService";
import { ISupplier } from "@/types/supplier";
import { formatNumberId } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSuppliers } from "./suppliers-provider";

// Actions Cell Component with Confirm Dialog
function ActionsCell({ supplier }: { supplier: ISupplier }) {
  const { setOpen, setCurrentRow } = useSuppliers();
  const queryClient = useQueryClient();
  const { canUpdate, canDelete } = useFeaturePermissions(Feature.SUPPLIERS);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await supplierService.delete(supplier.id);
      toast.success("Đã xóa nhà cung cấp thành công");

      // Invalidate and refetch suppliers data
      await queryClient.invalidateQueries({
        queryKey: ["suppliers", "list"],
      });
    } catch (error: any) {
      toast.error(error?.message || "Không thể xóa nhà cung cấp");
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
              setCurrentRow(supplier);
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
        title="Xóa nhà cung cấp"
        desc={`Bạn có chắc muốn xóa nhà cung cấp "${supplier.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        destructive
        handleConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  );
}

export const suppliersColumns: ColumnDef<ISupplier>[] = [
  {
    accessorKey: "id",
    header: "Mã",
    cell: ({ row }) => <div className="font-medium">{formatNumberId(row.getValue("id"))}</div>,
  },
  {
    accessorKey: "name",
    header: "Tên nhà cung cấp",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <div className="max-w-[200px] truncate" title={name}>
          {name}
        </div>
      );
    },
  },
  {
    accessorKey: "contactPerson",
    header: "Người liên hệ",
    cell: ({ row }) => <div className="text-sm">{row.getValue("contactPerson") || "—"}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="text-sm">{row.getValue("email") || "—"}</div>,
  },
  {
    accessorKey: "phoneNumber",
    header: "Số điện thoại",
    cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("phoneNumber")}</div>,
  },
  {
    accessorKey: "address",
    header: "Địa chỉ",
    cell: ({ row }) => {
      const address = row.getValue("address") as string;
      return (
        <div className="max-w-[200px] truncate" title={address}>
          {address}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => <ActionsCell supplier={row.original} />,
    enableSorting: false,
  },
];
