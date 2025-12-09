import { z } from "zod";

export const bannerSchema = z.object({
  title: z.string().optional(),
  imageUrl: z.string().min(1, "Vui lòng tải lên hình ảnh banner"),
  linkUrl: z.string().url("URL liên kết không hợp lệ").optional().or(z.literal("")),
  isActive: z.boolean(),
});

export type BannerFormValues = z.infer<typeof bannerSchema>;
