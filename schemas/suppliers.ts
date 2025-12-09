import { z } from "zod";

export const supplierSchema = z.object({
  name: z.string().min(1, "Tên nhà cung cấp là bắt buộc"),
  contactPerson: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  phoneNumber: z.string().min(1, "Số điện thoại là bắt buộc"),
  address: z.string().min(1, "Địa chỉ là bắt buộc"),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;
