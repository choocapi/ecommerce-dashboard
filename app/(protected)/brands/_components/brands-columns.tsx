import InvalidImage from "@/components/common/invalid-image";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Feature } from "@/config/permissions-config";
import { useFeaturePermissions } from "@/hooks/use-feature-permissions";
import { brandService } from "@/services/brandService";
import { IBrand } from "@/types/products";
import { formatNumberId } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBrands } from "./brands-provider";

function ActionGroup({ brand }: { brand: IBrand }) {
  const { setOpen, setCurrentRow } = useBrands();
  const queryClient = useQueryClient();
  const { canUpdate, canDelete } = useFeaturePermissions(Feature.BRANDS);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await brandService.delete(brand.id);
      toast.success("Đã xóa thương hiệu thành công");

      // Invalidate and refetch brands data
      await queryClient.invalidateQueries({
        queryKey: ["brands", "list"],
      });
    } catch (error: any) {
      toast.error(error?.message || "Không thể xóa thương hiệu");
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
              setCurrentRow(brand);
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
        title="Xóa thương hiệu"
        desc={`Bạn có chắc muốn xóa thương hiệu "${brand.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        destructive
        handleConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  );
}

export const brandsColumns: ColumnDef<IBrand>[] = [
  {
    accessorKey: "id",
    header: "Mã",
    cell: ({ row }) => <div className="font-medium">{formatNumberId(row.getValue("id"))}</div>,
  },
  {
    accessorKey: "logoUrl",
    header: "Logo",
    cell: ({ row }) => {
      const logoUrl = row.getValue("logoUrl") as string;
      return (
        <div className="w-12 h-12">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${row.original.name} logo`}
              className="w-full h-full object-contain rounded-md border"
            />
          ) : (
            <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
              <InvalidImage />
            </div>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "Tên thương hiệu",
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
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("slug")}</div>,
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
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => <ActionGroup brand={row.original} />,
    enableSorting: false,
  },
];
