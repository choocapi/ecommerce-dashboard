import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Tên danh mục là bắt buộc"),
  slug: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url("URL hình ảnh không hợp lệ").optional().or(z.literal("")),
  isActive: z.boolean(),
  parentId: z.number().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
