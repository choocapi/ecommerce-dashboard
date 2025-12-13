export const OrderStatusEnum = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  RETURNED: "RETURNED",
  CANCELLED: "CANCELLED",
} as const;

export type OrderStatus = (typeof OrderStatusEnum)[keyof typeof OrderStatusEnum];

export const ReturnStatusEnum = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  COMPLETED: "COMPLETED",
} as const;

export type ReturnStatus = (typeof ReturnStatusEnum)[keyof typeof ReturnStatusEnum];

export const PaymentMethodEnum = {
  COD: "COD",
  VNPAY: "VNPAY",
  MOMO: "MOMO",
  ZALOPAY: "ZALOPAY",
} as const;

export type PaymentMethod = (typeof PaymentMethodEnum)[keyof typeof PaymentMethodEnum];

export const PaymentStatusEnum = {
  PENDING: "PENDING",
  PAID: "PAID",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
  FAILED: "FAILED",
} as const;

export type PaymentStatus = (typeof PaymentStatusEnum)[keyof typeof PaymentStatusEnum];

export const CouponTypeEnum = {
  FIXED: "FIXED",
  PERCENTAGE: "PERCENTAGE",
} as const;

export type CouponType = (typeof CouponTypeEnum)[keyof typeof CouponTypeEnum];

export const InventoryTransactionTypeEnum = {
  IN: "IN",
  OUT: "OUT",
  ADJUST: "ADJUST",
} as const;

export type InventoryTransactionType =
  (typeof InventoryTransactionTypeEnum)[keyof typeof InventoryTransactionTypeEnum];

export const RolesEnum = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  CUSTOMER: "CUSTOMER",
} as const;

export type Role = (typeof RolesEnum)[keyof typeof RolesEnum];

export const InternalUserRolesEnum = {
  ADMIN: RolesEnum.ADMIN,
  STAFF: RolesEnum.STAFF,
} as const;

export type InternalUserRole = (typeof InternalUserRolesEnum)[keyof typeof InternalUserRolesEnum];
