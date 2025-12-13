"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { NumberInput } from "@/components/shared/number-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { InventoryTransactionFormData, inventoryTransactionSchema } from "@/schemas/inventory";
import { inventoryTransactionService } from "@/services/inventoryTransactionService";
import { productQueries } from "@/services/productService";
import { supplierQueries } from "@/services/supplierService";
import { InventoryTransactionTypeEnum } from "@/types/enums";
import { IProduct } from "@/types/products";
import { ISupplier } from "@/types/supplier";

interface InventoryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentProduct: IProduct | null;
}

const transactionTypeOptions = [
  { value: InventoryTransactionTypeEnum.IN, label: "Nhập kho" },
  { value: InventoryTransactionTypeEnum.OUT, label: "Xuất kho" },
  { value: InventoryTransactionTypeEnum.ADJUST, label: "Điều chỉnh tồn kho" },
];

export function InventoryDrawer({ open, onOpenChange, currentProduct }: InventoryDrawerProps) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const form = useForm<InventoryTransactionFormData>({
    resolver: zodResolver(inventoryTransactionSchema),
    defaultValues: {
      type: InventoryTransactionTypeEnum.IN,
      quantity: 1,
      note: "",
    },
  });

  const selectedType = form.watch("type");

  // Fetch products when drawer is open
  const { data: productsData } = useQuery({
    ...productQueries.listAll(),
    enabled: open,
  });

  // Fetch suppliers
  const { data: suppliersData } = useQuery({
    ...supplierQueries.listAll(),
    enabled: open,
  });

  const products = productsData || [];
  const suppliers = suppliersData || [];

  // Create products map for quick lookup
  const productsMap = useMemo(() => {
    const map = new Map<number, IProduct>();
    products.forEach((product: IProduct) => {
      map.set(product.id, product);
    });
    return map;
  }, [products]);

  const productOptions = products.map((p: IProduct) => ({
    value: p.id.toString(),
    label: `${p.name} (SKU: ${p.sku})`,
  }));

  const supplierOptions = suppliers.map((s: ISupplier) => ({
    value: s.id.toString(),
    label: s.name,
  }));

  // Get selected product details for validation
  const selectedProductId = form.watch("productId");
  const selectedProduct = useMemo(() => {
    if (currentProduct) return currentProduct;
    if (selectedProductId) {
      return products.find((p: IProduct) => p.id === selectedProductId);
    }
    return null;
  }, [currentProduct, selectedProductId, products]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      if (currentProduct) {
        form.reset({
          productId: currentProduct.id,
          type: InventoryTransactionTypeEnum.IN,
          quantity: 1,
          targetQuantity: undefined,
          price: currentProduct.importPrice || undefined,
          note: "",
        });
      } else {
        form.reset({
          type: InventoryTransactionTypeEnum.IN,
          quantity: 1,
          note: "",
        });
      }
    }
  }, [open, currentProduct, form]);

  // Validate stock levels for OUT transactions
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "type" || name === "quantity") {
        const type = value.type;
        const quantity = value.quantity;
        const currentStock = selectedProduct?.quantity || 0;

        if (type === InventoryTransactionTypeEnum.OUT && quantity && quantity > currentStock) {
          form.setError("quantity", {
            type: "manual",
            message: `Số lượng xuất vượt quá tồn kho (còn ${currentStock})`,
          });
        } else {
          form.clearErrors("quantity");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, selectedProduct]);

  const handleSubmit = async (data: InventoryTransactionFormData) => {
    setLoading(true);
    try {
      const payload: any = {
        productId: data.productId,
        supplierId: data.supplierId,
        orderId: data.orderId || undefined,
        type: data.type,
        quantity: data.type === InventoryTransactionTypeEnum.ADJUST ? undefined : data.quantity,
        targetQuantity:
          data.type === InventoryTransactionTypeEnum.ADJUST ? data.targetQuantity : undefined,
        price: data.type === InventoryTransactionTypeEnum.IN ? data.price : undefined,
        note: data.note || undefined,
      };

      await inventoryTransactionService.create(payload);

      toast.success("Phiếu kho đã được tạo thành công");

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["products", "list"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-transactions", "list"] });

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create inventory transaction:", error);
      toast.error(error instanceof Error ? error.message : "Không thể tạo phiếu kho");
    } finally {
      setLoading(false);
    }
  };

  const currentStockText = selectedProduct
    ? `Tồn kho hiện tại: ${selectedProduct.quantity || 0} | Đã giữ: ${
        selectedProduct.reservedQuantity || 0
      }`
    : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-2xl">
        <SheetHeader className="text-start">
          <SheetTitle>Tạo phiếu kho</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            id="inventory-transaction-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex-1 space-y-6 overflow-y-auto px-4 pb-6"
          >
            {/* Product & Transaction Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thông tin giao dịch</h3>
              <div className="rounded-lg border bg-card p-4 space-y-4">
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sản phẩm</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const productId = Number(value);
                          field.onChange(productId);

                          // Auto-fill import price when product is selected
                          const selectedProduct = productsMap.get(productId);
                          if (selectedProduct?.importPrice) {
                            form.setValue("price", selectedProduct.importPrice);
                          }
                        }}
                        value={field.value?.toString()}
                        disabled={!!currentProduct}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn sản phẩm" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {productOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="max-w-[400px] truncate">{option.label}</div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {currentStockText && (
                  <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                    {currentStockText}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại giao dịch</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {transactionTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Quantity & Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Chi tiết</h3>
              <div className="rounded-lg border bg-card p-4 space-y-4">
                {/* Quantity or Target Quantity */}
                {selectedType === InventoryTransactionTypeEnum.ADJUST ? (
                  <FormField
                    control={form.control}
                    name="targetQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tồn kho sau điều chỉnh</FormLabel>
                        <FormControl>
                          <NumberInput placeholder="Nhập số lượng mong muốn" min={0} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số lượng</FormLabel>
                        <FormControl>
                          <NumberInput placeholder="Nhập số lượng" min={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Price for IN transactions */}
                {selectedType === InventoryTransactionTypeEnum.IN && (
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá nhập</FormLabel>
                        <FormControl>
                          <NumberInput
                            placeholder="Nhập giá nhập"
                            min={0}
                            suffix="VNĐ"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Supplier for IN transactions */}
                {selectedType === InventoryTransactionTypeEnum.IN && (
                  <FormField
                    control={form.control}
                    name="supplierId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nhà cung cấp</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn nhà cung cấp" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {supplierOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Order ID for OUT transactions */}
                {selectedType === InventoryTransactionTypeEnum.OUT && (
                  <FormField
                    control={form.control}
                    name="orderId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mã đơn hàng</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập mã đơn hàng (tùy chọn)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Notes */}
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ghi chú</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập ghi chú (tùy chọn)"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>

        <SheetFooter className="gap-2">
          <Button form="inventory-transaction-form" type="submit" disabled={loading}>
            {loading ? "Đang tạo..." : "Tạo phiếu kho"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
