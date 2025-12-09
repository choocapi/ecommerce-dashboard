import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  IOrder,
  IOrderItem,
  getOrderStatusColor,
  getOrderStatusLabel,
  getPaymentMethodLabel,
  getPaymentStatusLabel,
} from "@/types/order";
import { getProductImageUrl } from "@/types/products";
import { formatCurrency, formatDateTime, getShippingAddress } from "@/utils";
import { Printer } from "lucide-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { OrderInvoicePrint } from "./order-invoice-print";

type OrdersDetailSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: IOrder | null;
};

export function OrdersDetailSheet({ open, onOpenChange, order }: OrdersDetailSheetProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Hoa don ${order?.id?.slice(-8)?.toUpperCase() || "don-hang"}`,
  });

  const onPrintClick = () => {
    handlePrint();
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex flex-col w-full sm:max-w-2xl">
          <SheetHeader className="text-start">
            <SheetTitle>Chi tiết đơn hàng</SheetTitle>
          </SheetHeader>

          {order && (
            <div className="flex-1 overflow-y-auto px-4 pb-6">
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="space-y-4">
                  <div className="rounded-lg border bg-card p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">
                          Đơn hàng #{order.id?.slice(-8)?.toUpperCase()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Ngày tạo: {formatDateTime(order.orderedAt)}
                        </p>
                        {order.user && (
                          <p className="text-sm text-muted-foreground">
                            Khách hàng: {order.user.firstName || ""} {order.user.lastName || ""} (
                            {order.user.email})
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className={getOrderStatusColor(order.status)}>
                        {getOrderStatusLabel(order.status)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                {order.items && order.items.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Sản phẩm đơn hàng</h3>
                    <div className="rounded-lg border bg-card p-4 space-y-3">
                      {order.items.map((item: IOrderItem, index: number) => {
                        const itemsLength = order.items?.length ?? 0;
                        return (
                          <div
                            key={index}
                            className={`flex items-start justify-between gap-4 p-3 ${
                              index < itemsLength - 1 ? "border-b" : ""
                            }`}
                          >
                            {/* Left */}
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <img
                                src={
                                  item.product
                                    ? getProductImageUrl(item.product)
                                    : "/placeholder-product.png"
                                }
                                alt={item.product?.name}
                                className="w-12 h-12 object-contain rounded-md shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-sm">
                                  {item.product?.name || `Sản phẩm ${item.productId}`}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  SKU: {item.product?.sku || "—"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Số lượng: {item.quantity}
                                </p>
                              </div>
                            </div>

                            {/* Right */}
                            <div className="text-right min-w-[120px]">
                              <p className="font-medium text-sm">
                                {item.unitPrice
                                  ? formatCurrency(item.unitPrice * item.quantity)
                                  : "—"}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      {order.totalAmount && (
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                          <p className="font-semibold">Tổng tiền</p>
                          <p className="font-semibold text-lg">
                            {formatCurrency(order.totalAmount)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Shipping Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Thông tin giao hàng</h3>
                  <div className="rounded-lg border bg-card p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Tên người nhận
                        </label>
                        <p className="text-sm mt-1">{order.shippingName || "—"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Số điện thoại
                        </label>
                        <p className="text-sm mt-1">{order.shippingPhone || "—"}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-muted-foreground">Địa chỉ</label>
                        <p className="text-sm mt-1">{getShippingAddress(order)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment & Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Thanh toán & Trạng thái</h3>
                  <div className="rounded-lg border bg-card p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Phương thức thanh toán
                        </label>
                        <p className="text-sm mt-1">
                          {order.paymentMethod
                            ? getPaymentMethodLabel(order.paymentMethod)
                            : "Không xác định"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Trạng thái thanh toán
                        </label>
                        <p className="text-sm mt-1">
                          {order.paymentStatus
                            ? getPaymentStatusLabel(order.paymentStatus)
                            : "Không xác định"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Trạng thái đơn hàng
                        </label>
                        <p className="text-sm mt-1">{getOrderStatusLabel(order.status)}</p>
                      </div>
                    </div>

                    {/* Timestamps */}
                    {(order.confirmedAt ||
                      order.shippedAt ||
                      order.deliveredAt ||
                      order.cancelledAt) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                        {order.confirmedAt && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Ngày xác nhận
                            </label>
                            <p className="text-sm mt-1">{formatDateTime(order.confirmedAt)}</p>
                          </div>
                        )}
                        {order.shippedAt && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Ngày giao hàng
                            </label>
                            <p className="text-sm mt-1">{formatDateTime(order.shippedAt)}</p>
                          </div>
                        )}
                        {order.deliveredAt && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Ngày nhận hàng
                            </label>
                            <p className="text-sm mt-1">{formatDateTime(order.deliveredAt)}</p>
                          </div>
                        )}
                        {order.cancelledAt && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Ngày hủy
                            </label>
                            <p className="text-sm mt-1">{formatDateTime(order.cancelledAt)}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Discount & Coupon */}
                {(order.discountAmount || order.couponCode) && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Giảm giá đã dùng</h3>
                    <div className="rounded-lg border bg-card p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {order.discountAmount && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Đã giảm
                            </label>
                            <p className="text-sm font-medium mt-1">
                              {formatCurrency(order.discountAmount)}
                            </p>
                          </div>
                        )}
                        {order.couponCode && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Mã giảm giá
                            </label>
                            <p className="text-sm mt-1">{order.couponCode}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <SheetFooter className="gap-2">
            <Button onClick={onPrintClick} variant="default" className="gap-2">
              <Printer className="h-4 w-4" />
              In hóa đơn
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Hidden print content */}
      <div className="hidden">
        <OrderInvoicePrint ref={printRef} order={order} />
      </div>
    </>
  );
}
