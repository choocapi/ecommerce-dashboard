import { InventoryTransactionTypeEnum } from "@/types/enums";
import { z } from "zod";

export const inventoryTransactionSchema = z
  .object({
    productId: z.number().int().positive("Sản phẩm là bắt buộc"),
    supplierId: z.number().int().positive().optional(),
    orderId: z.string().optional(),
    type: z.nativeEnum(InventoryTransactionTypeEnum, {
      error: "Loại giao dịch là bắt buộc",
    }),
    quantity: z.number().int().min(1, "Số lượng phải lớn hơn 0").optional(),
    targetQuantity: z.number().int().min(0, "Tồn kho mục tiêu phải >= 0").optional(),
    price: z.number().min(0, "Giá nhập không hợp lệ").optional(),
    note: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Validation rules based on transaction type
    if (data.type === InventoryTransactionTypeEnum.ADJUST) {
      if (data.targetQuantity === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Tồn kho mục tiêu là bắt buộc cho loại điều chỉnh",
          path: ["targetQuantity"],
        });
      }
      if (data.quantity !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Không được nhập số lượng cho loại điều chỉnh",
          path: ["quantity"],
        });
      }
    } else {
      // IN or OUT transaction
      if (data.quantity === undefined || data.quantity <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Số lượng là bắt buộc và phải > 0",
          path: ["quantity"],
        });
      }
      if (data.targetQuantity !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Không được nhập tồn kho mục tiêu cho loại này",
          path: ["targetQuantity"],
        });
      }
    }

    // Price validation for IN transactions
    if (
      data.type === InventoryTransactionTypeEnum.IN &&
      data.price !== undefined &&
      data.price < 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Giá nhập không hợp lệ",
        path: ["price"],
      });
    }
  });

export type InventoryTransactionFormData = z.infer<typeof inventoryTransactionSchema>;
