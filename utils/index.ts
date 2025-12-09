import { InventoryTransactionTypeEnum } from "@/types/enums";
import { IInventoryTransaction } from "@/types/inventory";
import { IOrder } from "@/types/order";
import { IUser } from "@/types/user";

export const formatDateTime = (dateString?: string) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDate = (dateString?: string) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const formatNumber = (amount: number) => {
  return new Intl.NumberFormat("vi-VN").format(amount);
};

export const getUserFullName = (user: IUser | undefined) => {
  if (!user) return "—";
  return `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
};

export const getShippingAddress = (order: IOrder | undefined) => {
  if (!order) return "—";
  return `${order?.shippingAddress}, ${order?.shippingWard}, ${order?.shippingDistrict}, ${order?.shippingCity}`;
};

export const formatQuantityChange = (transaction: IInventoryTransaction) => {
  const qty = transaction.quantity || 0;
  if (transaction.type === InventoryTransactionTypeEnum.IN) {
    return `+${qty}`;
  }
  if (transaction.type === InventoryTransactionTypeEnum.OUT) {
    return `-${qty}`;
  }
  const previous = transaction.previousQuantity ?? 0;
  const resulting = transaction.resultingQuantity ?? previous;
  const delta = resulting - previous;
  if (delta === 0) return "0";
  return `${delta > 0 ? "+" : "-"}${Math.abs(delta)}`;
};

export const formatUuid = (uuid?: string) => {
  return `#${uuid?.slice(0, 8).toUpperCase() || ""}`;
};

export const formatNumberId = (id?: number) => {
  return `#${id?.toString() || ""}`;
};

export { calculateDiscountedPrice, deriveDiscountPercentage } from "./pricingUtils";
