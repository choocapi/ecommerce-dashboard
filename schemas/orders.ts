import { z } from 'zod'
import { OrderStatusEnum, PaymentMethodEnum, PaymentStatusEnum } from '@/types/enums'

export const newOrderSchema = z.object({
  shippingName: z.string().min(1, 'Tên người nhận là bắt buộc'),
  shippingPhone: z.string().min(1, 'Số điện thoại là bắt buộc'),
  shippingAddress: z.string().min(1, 'Địa chỉ là bắt buộc'),
  shippingWard: z.string().optional(),
  shippingDistrict: z.string().optional(),
  shippingCity: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentMethodEnum),
  paymentStatus: z.nativeEnum(PaymentStatusEnum),
  status: z.nativeEnum(OrderStatusEnum),
  orderItems: z.array(
    z.object({
      productId: z.string().min(1, 'Vui lòng chọn sản phẩm'),
      quantity: z.number().min(1, 'Số lượng phải lớn hơn 0'),
    })
  ).min(1, 'Phải có ít nhất một sản phẩm'),
})

export type NewOrderFormValues = z.infer<typeof newOrderSchema>
