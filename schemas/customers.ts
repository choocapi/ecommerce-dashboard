import { z } from "zod";

export const customerSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  isActive: z.boolean(),
  emailVerified: z.boolean(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
