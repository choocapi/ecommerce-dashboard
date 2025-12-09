import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  IProduct,
  getProductImageUrl,
  getProductStatusVariant,
  getQuantityVariant,
} from "@/types/products";
import { formatCurrency, formatNumber } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { productService } from "@/services/productService";
import { useProducts } from "./products-provider";
import { useFeaturePermissions } from "@/hooks/use-feature-permissions";
import { Feature } from "@/config/permissions-config";

// Actions Cell Component with Confirm Dialog
function ActionsCell({ product }: { product: IProduct }) {
  const { setOpen, setCurrentRow } = useProducts();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { canUpdate, canDelete } = useFeaturePermissions(Feature.PRODUCTS);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await productService.delete(product.id);
      toast.success("Đã xóa sản phẩm thành công");

      // Invalidate and refetch products data
      await queryClient.invalidateQueries({
        queryKey: ["products", "list"],
      });
    } catch (error: any) {
      toast.error(error?.message || "Không thể xóa sản phẩm");
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
    }
  };

  // Don't show actions if user has no permissions
  if (!canUpdate && !canDelete) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/products/${product.id}`)}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">Xem chi tiết</span>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/products/${product.id}`)}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">Xem chi tiết</span>
        </Button>
        {canUpdate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCurrentRow(product);
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
        title="Xóa sản phẩm"
        desc={`Bạn có chắc muốn xóa sản phẩm "${product.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        destructive
        handleConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  );
}

export const productsColumns: ColumnDef<IProduct>[] = [
  {
    accessorKey: "imageUrls",
    header: "Hình ảnh",
    cell: ({ row }) => {
      const product = row.original;
      const imageUrl = getProductImageUrl(product);
      return (
        <div className="w-12 h-12">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
              <span className="text-xs text-gray-400">No image</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => <div className="font-medium">{row.getValue("sku")}</div>,
  },
  {
    accessorKey: "name",
    header: "Tên sản phẩm",
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
    accessorKey: "price",
    header: "Giá bán",
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return <div className="font-medium">{formatCurrency(price)}</div>;
    },
  },
  {
    accessorKey: "quantity",
    header: "Tồn kho",
    cell: ({ row }) => {
      const quantity = row.getValue("quantity") as number;
      return (
        <Badge variant={getQuantityVariant(quantity)} className="font-medium">
          {formatNumber(quantity)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isPublished",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished") as boolean;
      return (
        <Badge variant={getProductStatusVariant(isPublished)} className="font-medium">
          {isPublished ? "Đang bán" : "Ngừng bán"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Danh mục",
    cell: ({ row }) => {
      const category = row.original.category;
      return <div>{category?.name || "—"}</div>;
    },
  },
  {
    accessorKey: "brand",
    header: "Thương hiệu",
    cell: ({ row }) => {
      const brand = row.original.brand;
      return <div>{brand?.name || "—"}</div>;
    },
  },
  // Hidden columns for filtering
  {
    id: "categoryId",
    accessorFn: (row) => row.categoryId,
    header: () => null,
    cell: () => null,
    enableHiding: true,
    enableSorting: false,
  },
  {
    id: "brandId",
    accessorFn: (row) => row.brandId,
    header: () => null,
    cell: () => null,
    enableHiding: true,
    enableSorting: false,
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => <ActionsCell product={row.original} />,
  },
];
