import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IProduct, getProductImageUrl, getQuantityVariant } from "@/types/products";
import { formatCurrency } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useInventory } from "./inventory-provider";
import { useFeaturePermissions } from "@/hooks/use-feature-permissions";
import { Feature } from "@/config/permissions-config";

// Actions Cell Component
function ActionsCell({ product }: { product: IProduct }) {
  const router = useRouter();
  const { setOpen, setCurrentRow } = useInventory();
  const { canCreate } = useFeaturePermissions(Feature.INVENTORY);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`/inventory/${product.id}`)}
        className="h-8 w-8 p-0"
      >
        <Eye className="h-4 w-4" />
        <span className="sr-only">Xem chi tiết</span>
      </Button>
      {canCreate && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setCurrentRow(product);
            setOpen("create");
          }}
          className="h-8 w-8 p-0"
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Tạo giao dịch</span>
        </Button>
      )}
    </div>
  );
}

export const inventoryColumns: ColumnDef<IProduct>[] = [
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
            <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
              <span className="text-xs text-muted-foreground">No image</span>
            </div>
          )}
        </div>
      );
    },
    enableSorting: false,
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
    accessorKey: "category.name",
    header: "Danh mục",
    cell: ({ row }) => {
      const category = row.original.category;
      return <div className="max-w-[120px] truncate">{category?.name || "—"}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "quantity",
    header: "Tồn kho",
    cell: ({ row }) => {
      const quantity = (row.getValue("quantity") as number) || 0;
      return (
        <Badge variant={getQuantityVariant(quantity)} className="font-medium">
          {quantity}
        </Badge>
      );
    },
  },
  {
    accessorKey: "reservedQuantity",
    header: "Đã giữ",
    cell: ({ row }) => {
      const reserved = (row.getValue("reservedQuantity") as number) || 0;
      return <div className="text-sm text-muted-foreground">{reserved}</div>;
    },
  },
  {
    accessorKey: "importPrice",
    header: "Giá nhập",
    cell: ({ row }) => {
      const price = row.getValue("importPrice") as number;
      return <div className="text-sm">{price ? formatCurrency(price) : "—"}</div>;
    },
  },
  {
    accessorKey: "isPublished",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished") as boolean;
      return (
        <Badge variant={isPublished ? "default" : "secondary"}>
          {isPublished ? "Đang bán" : "Ngừng bán"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => <ActionsCell product={row.original} />,
    enableSorting: false,
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
];
