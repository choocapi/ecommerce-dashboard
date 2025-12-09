import { z } from "zod";

export const productSchema = z.object({
  sku: z.string().min(1, "SKU là bắt buộc"),
  name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  slug: z.string().min(1, "Slug là bắt buộc"),
  description: z.string().optional(),
  price: z.number().min(0, "Giá bán phải lớn hơn 0"),
  originalPrice: z.number().min(0).optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
  importPrice: z.number().min(0).optional(),
  categoryId: z.number().optional(),
  brandId: z.number().optional(),
  specifications: z.string(),
  quantity: z.number().min(0, "Số lượng phải lớn hơn hoặc bằng 0"),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
  imageUrls: z.array(z.string()).optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
