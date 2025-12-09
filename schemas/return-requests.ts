import { z } from "zod";
import { ReturnStatusEnum } from "@/types/enums";

export const returnRequestSchema = z.object({
  status: z.nativeEnum(ReturnStatusEnum, {
    required_error: "Vui lòng chọn trạng thái",
  }),
  adminNote: z.string().optional(),
});

export type ReturnRequestFormValues = z.infer<typeof returnRequestSchema>;
