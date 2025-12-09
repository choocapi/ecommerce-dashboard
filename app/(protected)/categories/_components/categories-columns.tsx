import InvalidImage from "@/components/common/invalid-image";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Feature } from "@/config/permissions-config";
import { useFeaturePermissions } from "@/hooks/use-feature-permissions";
import { categoryService } from "@/services/categoryService";
import { ICategory } from "@/types/products";
import { formatNumberId } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { useCategories } from "./categories-provider";

// Actions Cell Component with Confirm Dialog
function ActionsCell({ category }: { category: ICategory }) {
  const { setOpen, setCurrentRow } = useCategories();
  const queryClient = useQueryClient();
  const { canUpdate, canDelete } = useFeaturePermissions(Feature.CATEGORIES);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await categoryService.delete(category.id);
      toast.success("Đã xóa danh mục thành công");

      // Invalidate and refetch categories data
      await queryClient.invalidateQueries({
        queryKey: ["categories", "list"],
      });
    } catch (error: any) {
      toast.error(error?.message || "Không thể xóa danh mục");
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
              setCurrentRow(category);
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
        title="Xóa danh mục"
        desc={`Bạn có chắc muốn xóa danh mục "${category.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        destructive
        handleConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  );
}

export const categoriesColumns: ColumnDef<ICategory>[] = [
  {
    accessorKey: "id",
    header: "Mã",
    cell: ({ row }) => <div className="font-medium">{formatNumberId(row.getValue("id"))}</div>,
  },
  {
    accessorKey: "imageUrl",
    header: "Ảnh",
    cell: ({ row }) => {
      const imageUrl = row.getValue("imageUrl") as string;
      return imageUrl ? (
        <div className="relative w-12 h-12 rounded-md overflow-hidden border border-gray-200">
          <Image src={imageUrl} alt="Category" fill className="object-cover" />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center">
          <InvalidImage />
        </div>
      );
    },
  },

  {
    accessorKey: "name",
    header: "Tên danh mục",
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
    accessorKey: "parent",
    header: "Danh mục cha",
    cell: ({ row }) => {
      const parent = row.original.parent;
      return <div>{parent?.name || "—"}</div>;
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
    cell: ({ row }) => <ActionsCell category={row.original} />,
    enableSorting: false,
  },
];
