import { AddressSelect } from "@/components/shared/address-select";
import { SelectDropdown } from "@/components/shared/select-dropdown";
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
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { newOrderSchema, type NewOrderFormValues } from "@/schemas";
import { orderService } from "@/services/orderService";
import { productService } from "@/services/productService";
import { OrderStatusEnum, PaymentMethodEnum, PaymentStatusEnum } from "@/types/enums";
import { getOrderStatusLabel, getPaymentMethodLabel, getPaymentStatusLabel } from "@/types/order";
import { IProduct } from "@/types/products";
import { formatCurrency } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

type OrdersDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function OrdersDrawer({ open, onOpenChange }: OrdersDrawerProps) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<{ value: string; label: string; price: number }[]>([]);
  const [productsMap, setProductsMap] = useState<Map<number, IProduct>>(new Map());
  const [productsLoading, setProductsLoading] = useState(false);

  const form = useForm<NewOrderFormValues>({
    resolver: zodResolver(newOrderSchema),
    defaultValues: {
      shippingName: "",
      shippingPhone: "",
      shippingAddress: "",
      shippingWard: "",
      shippingDistrict: "",
      shippingCity: "",
      paymentMethod: PaymentMethodEnum.COD,
      paymentStatus: PaymentStatusEnum.PENDING,
      status: OrderStatusEnum.PENDING,
      orderItems: [{ productId: "", quantity: 1 }],
    },
  });

  // Fetch products when drawer opens
  useEffect(() => {
    if (open) {
      fetchProducts();
    }
  }, [open]);

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const productsData = await productService.listAll();

      const prodMap = new Map<number, IProduct>();
      productsData.forEach((product: IProduct) => {
        prodMap.set(product.id, product);
      });
      setProductsMap(prodMap);

      setProducts(
        productsData.map((product: IProduct) => {
          // Giới hạn tên sản phẩm tối đa 30 ký tự
          const truncatedName =
            product.name.length > 30 ? product.name.substring(0, 30) + "..." : product.name;
          return {
            value: product.id.toString(),
            label: `${truncatedName} (${product.price.toLocaleString("vi-VN")} đ)`,
            price: product.price,
          };
        }),
      );
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setProductsLoading(false);
    }
  };

  const handleSubmit = async (values: NewOrderFormValues) => {
    setLoading(true);
    try {
      // Calculate subtotal and total
      let subtotal = 0;
      const items = values.orderItems.map((item) => {
        const product = productsMap.get(Number(item.productId));
        const unitPrice = product?.price || 0;
        const totalPrice = unitPrice * item.quantity;
        subtotal += totalPrice;

        return {
          productId: Number(item.productId),
          quantity: item.quantity,
          unitPrice: unitPrice,
          totalPrice: totalPrice,
        };
      });

      const totalAmount = subtotal;

      const payload: any = {
        shippingName: values.shippingName,
        shippingPhone: values.shippingPhone,
        shippingAddress: values.shippingAddress,
        shippingWard: values.shippingWard,
        shippingDistrict: values.shippingDistrict,
        shippingCity: values.shippingCity,
        paymentMethod: values.paymentMethod,
        paymentStatus: values.paymentStatus,
        status: values.status,
        subtotal: subtotal,
        totalAmount: totalAmount,
        items: items,
      };

      await orderService.create(payload);

      toast.success("Đơn hàng đã được tạo thành công");

      // Invalidate and refetch orders data
      await queryClient.invalidateQueries({
        queryKey: ["orders", "list"],
      });

      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast.error(error?.message || "Không thể tạo đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const addOrderItem = () => {
    const currentItems = form.getValues("orderItems");
    form.setValue("orderItems", [...currentItems, { productId: "", quantity: 1 }]);
  };

  const removeOrderItem = (index: number) => {
    const currentItems = form.getValues("orderItems");
    if (currentItems.length > 1) {
      form.setValue(
        "orderItems",
        currentItems.filter((_, i) => i !== index),
      );
    }
  };

  const statusOptions = [
    OrderStatusEnum.PENDING,
    OrderStatusEnum.PROCESSING,
    OrderStatusEnum.SHIPPED,
  ].map((status) => ({
    label: getOrderStatusLabel(status),
    value: status,
  }));

  const paymentMethodOptions = Object.values(PaymentMethodEnum).map((method) => ({
    label: getPaymentMethodLabel(method),
    value: method,
  }));

  const paymentStatusOptions = [PaymentStatusEnum.PENDING, PaymentStatusEnum.PAID].map(
    (status) => ({
      label: getPaymentStatusLabel(status),
      value: status,
    }),
  );

  // Watch order items for real-time updates
  const orderItems = useWatch({
    control: form.control,
    name: "orderItems",
  });

  // Calculate total amount
  const totalAmount = useMemo(() => {
    let total = 0;
    orderItems?.forEach((item) => {
      const product = productsMap.get(Number(item.productId));
      if (product && item.quantity > 0) {
        total += product.price * item.quantity;
      }
    });
    return total;
  }, [orderItems, productsMap]);

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) form.reset();
      }}
    >
      <SheetContent className="flex flex-col w-full sm:max-w-2xl">
        <SheetHeader className="text-start">
          <SheetTitle>Tạo đơn hàng mới</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            id="orders-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex-1 space-y-6 overflow-y-auto px-4 pb-6"
          >
            {/* Shipping Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thông tin giao hàng</h3>
              <div className="rounded-lg border bg-card p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="shippingName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên người nhận</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nhập tên người nhận" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shippingPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nhập số điện thoại" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="shippingAddress"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Địa chỉ</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập địa chỉ" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-4">
                  <AddressSelect
                    control={form.control}
                    setValue={form.setValue}
                    cityField="shippingCity"
                    districtField="shippingDistrict"
                    wardField="shippingWard"
                  />
                </div>
              </div>
            </div>

            {/* Payment & Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thanh toán & Trạng thái</h3>
              <div className="rounded-lg border bg-card p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phương thức thanh toán</FormLabel>
                        <SelectDropdown
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          items={paymentMethodOptions}
                          placeholder="Chọn phương thức thanh toán"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="paymentStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trạng thái thanh toán</FormLabel>
                        <SelectDropdown
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          items={paymentStatusOptions}
                          placeholder="Chọn trạng thái thanh toán"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trạng thái đơn hàng</FormLabel>
                        <SelectDropdown
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          items={statusOptions}
                          placeholder="Chọn trạng thái đơn hàng"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Sản phẩm đơn hàng</h3>
                <Button type="button" variant="outline" size="sm" onClick={addOrderItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm sản phẩm
                </Button>
              </div>

              <div className="rounded-lg border bg-card p-4 space-y-3">
                {orderItems.map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 ${index < orderItems.length - 1 ? "border-b" : ""}`}
                  >
                    <div className="flex items-end gap-4">
                      <div className="flex-1 min-w-0">
                        <FormField
                          control={form.control}
                          name={`orderItems.${index}.productId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sản phẩm</FormLabel>
                              <SelectDropdown
                                defaultValue={field.value}
                                onValueChange={field.onChange}
                                items={products}
                                placeholder="Chọn sản phẩm"
                                disabled={productsLoading}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex items-end gap-2 shrink-0">
                        <FormField
                          control={form.control}
                          name={`orderItems.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Số lượng</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  min={1}
                                  placeholder="SL"
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  className="w-20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {orderItems.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeOrderItem(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                  <p className="font-semibold">Tổng tiền</p>
                  <p className="font-semibold text-lg">{formatCurrency(totalAmount)}</p>
                </div>
              </div>
            </div>
          </form>
        </Form>
        <SheetFooter className="gap-2">
          <Button form="orders-form" type="submit" disabled={loading}>
            {loading ? "Đang tạo..." : "Tạo đơn hàng"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
