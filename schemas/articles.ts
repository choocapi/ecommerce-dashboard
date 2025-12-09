import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc"),
  slug: z.string().optional(),
  content: z.string().min(1, "Nội dung là bắt buộc"),
  featuredImage: z.string().url("URL hình ảnh không hợp lệ").optional().or(z.literal("")),
  category: z.string().optional(),
  isPublished: z.boolean(),
});

export type ArticleFormValues = z.infer<typeof articleSchema>;
