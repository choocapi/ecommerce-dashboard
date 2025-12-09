import type { OrderStatus, PaymentMethod, PaymentStatus } from "./enums";
import { IProduct } from "./products";
import { IUser } from "./user";

export interface IOrder {
  id: string; // UUID
  userId?: string; // UUID
  user?: IUser;
  status: OrderStatus;
  shippingName?: string;
  shippingPhone?: string;
  shippingAddress?: string;
  shippingWard?: string;
  shippingDistrict?: string;
  shippingCity?: string;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  vnPayOrderId?: string; // VNPay transaction reference
  momoOrderId?: string; // MoMo transaction reference
  zaloPayOrderId?: string; // ZaloPay transaction reference
  subtotal?: number;
  discountAmount?: number;
  totalAmount?: number;
  couponCode?: string;
  orderedAt?: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  items?: IOrderItem[];
}

export interface IOrderItem {
  id: number;
  orderId?: string; // UUID
  order?: IOrder;
  productId?: number;
  product?: IProduct;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Chờ duyệt",
  PROCESSING: "Đang xử lý",
  SHIPPED: "Đang giao",
  DELIVERED: "Đã giao",
  RETURNED: "Đã trả hàng",
  CANCELLED: "Đã hủy",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  COD: "COD",
  MOMO: "MOMO",
  VNPAY: "VNPay",
  ZALOPAY: "ZaloPay",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  CANCELLED: "Đã hủy",
  REFUNDED: "Đã hoàn trả",
  FAILED: "Thất bại",
};

export const getOrderStatusLabel = (status: string): string => {
  return ORDER_STATUS_LABELS[status as OrderStatus] || status || "Unknown";
};

export const getPaymentMethodLabel = (method: string): string => {
  return PAYMENT_METHOD_LABELS[method as PaymentMethod] || method || "Unknown";
};

export const getPaymentStatusLabel = (status: string): string => {
  return PAYMENT_STATUS_LABELS[status as PaymentStatus] || status || "Unknown";
};

export const getOrderStatusColor = (status: string): string => {
  switch (status) {
    case "PENDING":
      return "bg-amber-100/30 text-amber-900 dark:text-amber-200 border-amber-200";
    case "PROCESSING":
      return "bg-blue-100/30 text-blue-900 dark:text-blue-200 border-blue-200";
    case "SHIPPED":
      return "bg-purple-100/30 text-purple-900 dark:text-purple-200 border-purple-200";
    case "DELIVERED":
      return "bg-green-100/30 text-green-900 dark:text-green-200 border-green-200";
    case "CANCELLED":
      return "bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10";
    case "RETURNED":
      return "bg-orange-100/30 text-orange-900 dark:text-orange-200 border-orange-200";
    default:
      return "bg-gray-100/30 text-gray-900 dark:text-gray-200 border-gray-200";
  }
};
