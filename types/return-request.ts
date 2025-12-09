import type { ReturnStatus } from "./enums";
import type { IUser } from "./user";

export interface IReturnRequest {
  id: number;
  orderId: string;
  userId: string;
  user?: IUser;
  reason: string;
  imageUrls?: string; // JSON string array: ["url1", "url2", ...]
  status: ReturnStatus;
  adminNote?: string;
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  completedAt?: string;
}

export const RETURN_STATUS_LABELS: Record<ReturnStatus, string> = {
  PENDING: "Chờ xử lý",
  APPROVED: "Đã chấp nhận",
  REJECTED: "Đã từ chối",
  COMPLETED: "Đã hoàn tất",
};

export const getReturnStatusLabel = (status: string): string => {
  return RETURN_STATUS_LABELS[status as ReturnStatus] || status || "Không xác định";
};

export const getReturnStatusColor = (status: string): string => {
  switch (status) {
    case "PENDING":
      return "bg-amber-100/30 text-amber-900 dark:text-amber-200 border-amber-200";
    case "APPROVED":
      return "bg-green-100/30 text-green-900 dark:text-green-200 border-green-200";
    case "REJECTED":
      return "bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10";
    case "COMPLETED":
      return "bg-blue-100/30 text-blue-900 dark:text-blue-200 border-blue-200";
    default:
      return "bg-gray-100/30 text-gray-900 dark:text-gray-200 border-gray-200";
  }
};
