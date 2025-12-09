"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { inventoryTransactionService } from "@/services/inventoryTransactionService";
import { productQueries } from "@/services/productService";
import { InventoryTransactionTypeEnum } from "@/types/enums";
import { IProduct } from "@/types/products";
import { formatCurrency, formatDateTime } from "@/utils";

import Link from "next/link";
import { useState } from "react";
import { InventoryMutateDrawer } from "../_components/inventory-mutate-drawer";
import { InventoryProvider } from "../_components/inventory-provider";
import { InventoryTransactionsTable } from "../_components/inventory-transactions-table";
import ProductImages from "./_components/product-images";

export default function InventoryDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = params?.id ? Number(params.id) : null;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  // Fetch product details
  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useQuery({
    ...productQueries.detail(productId!),
  });

  // Fetch latest inbound transaction for overview
  const { data: latestInbound } = useQuery({
    queryKey: ["inventory-transactions", "latest-inbound", productId],
    queryFn: async () => {
      if (!productId) return null;
      const response = await inventoryTransactionService.listByProduct(
        productId,
        0,
        1,
        InventoryTransactionTypeEnum.IN,
      );
      return response.content?.[0] || null;
    },
    enabled: !!productId,
  });

  const handleCreateTransaction = (product: IProduct) => {
    setSelectedProduct(product);
    setDrawerOpen(true);
  };

  if (productLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Không tìm thấy sản phẩm</h2>
          <p className="text-muted-foreground mt-2">
            Sản phẩm có ID {productId} không tồn tại hoặc đã bị xóa.
          </p>
          <Button variant="outline" onClick={() => router.push("/inventory")} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  const overviewItems = [
    { label: "SKU", value: product.sku },
    { label: "Danh mục", value: product.category?.name || "—" },
    { label: "Thương hiệu", value: product.brand?.name || "—" },
    {
      label: "Giá nhập",
      value: product.importPrice ? formatCurrency(product.importPrice) : "—",
    },
    { label: "Tồn kho hiện tại", value: (product.quantity ?? 0).toString() },
    { label: "Số lượng đã giữ", value: (product.reservedQuantity ?? 0).toString() },
    {
      label: "Ngày nhập gần nhất",
      value: latestInbound?.createdAt ? formatDateTime(latestInbound.createdAt) : "—",
    },
  ];

  return (
    <InventoryProvider>
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-muted-foreground">Chi tiết tồn kho sản phẩm</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/inventory">
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Link>
            </Button>
            <Button onClick={() => handleCreateTransaction(product)}>
              <Plus className="h-4 w-4" />
              Tạo giao dịch
            </Button>
          </div>
        </div>

        {/* Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Thông tin sản phẩm</TabsTrigger>
            <TabsTrigger value="transactions">Lịch sử giao dịch</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Product Images */}
              <ProductImages product={product} />

              {/* Product Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin chi tiết</CardTitle>
                  <CardDescription>Thông tin tồn kho và chi tiết sản phẩm</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {overviewItems.map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        {item.label}
                      </span>
                      <span className="text-sm">{item.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Lịch sử giao dịch kho</CardTitle>
                <CardDescription>
                  Tất cả các giao dịch nhập, xuất và điều chỉnh tồn kho
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InventoryTransactionsTable productId={product.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <InventoryMutateDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        currentProduct={selectedProduct}
      />
    </InventoryProvider>
  );
}
