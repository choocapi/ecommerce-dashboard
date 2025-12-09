import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().min(1, "Tên thương hiệu là bắt buộc"),
  slug: z.string().optional(),
  description: z.string().optional(),
  logoUrl: z.string().url("URL logo không hợp lệ").optional().or(z.literal("")),
  isActive: z.boolean(),
});

export type BrandFormValues = z.infer<typeof brandSchema>;
