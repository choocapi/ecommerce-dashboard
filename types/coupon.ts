import type { CouponType } from "./enums";

export interface ICoupon {
  id: number;
  code: string;
  description?: string;
  type: CouponType;
  value: number;
  usageLimit?: number;
  usedCount?: number;
  startDate?: string; // Instant from backend
  endDate?: string; // Instant from backend
  isActive?: boolean;
}
