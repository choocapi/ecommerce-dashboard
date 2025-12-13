"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { NumberInput } from "@/components/shared/number-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import {
  CouponFormValues,
  couponSchema,
  formatDateForInput,
  parseDateFromInput,
} from "@/schemas/coupons";
import { couponService } from "@/services/couponService";
import { ICoupon } from "@/types/coupon";
import { CouponTypeEnum } from "@/types/enums";
import { Loader2 } from "lucide-react";

interface CouponsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCoupon: ICoupon | null;
}

export function CouponsDrawer({ open, onOpenChange, currentCoupon }: CouponsDrawerProps) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const isUpdate = !!currentCoupon;

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      description: "",
      type: "FIXED",
      value: 0,
      usageLimit: undefined,
      startDate: undefined,
      endDate: undefined,
      isActive: true,
    },
  });

  // Reset form when dialog opens/closes or coupon changes
  useEffect(() => {
    if (open) {
      if (currentCoupon) {
        form.reset({
          code: currentCoupon.code,
          description: currentCoupon.description || "",
          type: currentCoupon.type,
          value: currentCoupon.value,
          usageLimit: currentCoupon.usageLimit,
          startDate: currentCoupon.startDate ? new Date(currentCoupon.startDate) : undefined,
          endDate: currentCoupon.endDate ? new Date(currentCoupon.endDate) : undefined,
          isActive: currentCoupon.isActive ?? true,
        });
      } else {
        form.reset({
          code: "",
          description: "",
          type: "FIXED",
          value: 0,
          usageLimit: undefined,
          startDate: undefined,
          endDate: undefined,
          isActive: true,
        });
      }
    }
  }, [open, currentCoupon, form]);

  const handleSubmit = async (values: CouponFormValues) => {
    setLoading(true);
    try {
      const submitData = {
        ...values,
        description: values.description || undefined,
        usageLimit: values.usageLimit || undefined,
        startDate: values.startDate ? values.startDate.toISOString() : undefined,
        endDate: values.endDate ? values.endDate.toISOString() : undefined,
      };

      if (isUpdate && currentCoupon) {
        await couponService.update(currentCoupon.id, submitData);
        toast.success("Đã cập nhật mã giảm giá thành công");
      } else {
        await couponService.create(submitData);
        toast.success("Đã thêm mã giảm giá thành công");
      }

      // Invalidate and refetch coupons data
      await queryClient.invalidateQueries({
        queryKey: ["coupons", "list"],
      });

      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast.error(error?.message || `Không thể ${isUpdate ? "cập nhật" : "thêm"} mã giảm giá`);
    } finally {
      setLoading(false);
    }
  };

  const watchedType = form.watch("type");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-2xl">
        <SheetHeader className="text-start">
          <SheetTitle>{isUpdate ? "Chỉnh sửa mã giảm giá" : "Thêm mã giảm giá mới"}</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            id="coupons-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex-1 space-y-6 overflow-y-auto px-4 pb-6"
          >
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thông tin cơ bản</h3>
              <div className="rounded-lg border bg-card p-4 space-y-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã giảm giá</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập mã giảm giá" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Nhập mô tả mã giảm giá (tùy chọn)"
                          className="min-h-[80px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Discount Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Cài đặt giảm giá</h3>
              <div className="rounded-lg border bg-card p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loại mã giảm giá</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn loại mã giảm giá" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="FIXED">Giảm cố định</SelectItem>
                            <SelectItem value="PERCENTAGE">Giảm theo phần trăm</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Giá trị {watchedType === CouponTypeEnum.FIXED ? "(VNĐ)" : "(%)"}
                        </FormLabel>
                        <FormControl>
                          <NumberInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={`Nhập giá trị ${
                              watchedType === CouponTypeEnum.FIXED ? "VNĐ" : "%"
                            }`}
                            suffix={watchedType === CouponTypeEnum.FIXED ? "VNĐ" : "%"}
                            min={0}
                            max={watchedType === CouponTypeEnum.PERCENTAGE ? 100 : undefined}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Usage & Dates */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Giới hạn & Thời gian</h3>
              <div className="rounded-lg border bg-card p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="usageLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giới hạn sử dụng</FormLabel>
                        <FormControl>
                          <NumberInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Không giới hạn"
                            min={1}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày bắt đầu</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            value={formatDateForInput(field.value)}
                            onChange={(e) => field.onChange(parseDateFromInput(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày kết thúc</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            value={formatDateForInput(field.value)}
                            onChange={(e) => field.onChange(parseDateFromInput(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Trạng thái</h3>
              <div className="rounded-lg border bg-card p-4">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>Hoạt động</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>

        <SheetFooter className="gap-2">
          <Button form="coupons-form" type="submit">
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : isUpdate ? (
              "Cập nhật"
            ) : (
              "Thêm mã giảm giá"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
