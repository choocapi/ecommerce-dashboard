import { z } from "zod";

export const staffSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  roles: z.array(z.string()).min(1, "Phải chọn ít nhất 1 vai trò"),
  isActive: z.boolean(),
  emailVerified: z.boolean(),
});

// Schema for updating (password not required)
export const updateStaffSchema = staffSchema.omit({ password: true }).extend({
  password: z.string().optional(),
});

export type StaffFormValues = z.infer<typeof staffSchema>;
export type UpdateStaffFormValues = z.infer<typeof updateStaffSchema>;
