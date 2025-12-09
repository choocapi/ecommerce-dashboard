import { z } from "zod";

// Utility functions for date formatting
export const formatDateForInput = (date: Date | string | undefined): string => {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";

  // Format for datetime-local input: yyyy-MM-ddTHH:mm
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const parseDateFromInput = (value: string): Date | undefined => {
  if (!value) return undefined;
  const date = new Date(value);
  return isNaN(date.getTime()) ? undefined : date;
};

export const couponSchema = z
  .object({
    code: z
      .string()
      .min(1, "Mã giảm giá là bắt buộc")
      .max(50, "Mã giảm giá không được quá 50 ký tự"),
    description: z.string().optional(),
    type: z.enum(["FIXED", "PERCENTAGE"]).refine((val) => val, {
      message: "Loại mã giảm giá là bắt buộc",
    }),
    value: z.number().min(0, "Giá trị phải lớn hơn 0"),
    usageLimit: z.number().min(1, "Giới hạn sử dụng phải lớn hơn 0").optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    isActive: z.boolean(),
  })
  .refine(
    (data) => {
      // If type is PERCENTAGE, value should not exceed 100
      if (data.type === "PERCENTAGE" && data.value > 100) {
        return false;
      }
      return true;
    },
    {
      message: "Giá trị phần trăm không được vượt quá 100%",
      path: ["value"],
    },
  )
  .refine(
    (data) => {
      // If both startDate and endDate are provided, endDate should be after startDate
      if (data.startDate && data.endDate) {
        return data.endDate > data.startDate;
      }
      return true;
    },
    {
      message: "Ngày kết thúc phải sau ngày bắt đầu",
      path: ["endDate"],
    },
  );

export type CouponFormValues = z.infer<typeof couponSchema>;
