"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { CustomerFormValues, customerSchema } from "@/schemas/customers";
import { userService } from "@/services/userService";
import { IUser } from "@/types/user";

interface CustomersMutateDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCustomer: IUser | null;
}

export function CustomersMutateDrawer({
  open,
  onOpenChange,
  currentCustomer,
}: CustomersMutateDrawerProps) {
  const queryClient = useQueryClient();

  // Only allow update mode
  if (!currentCustomer) {
    return null;
  }

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      dateOfBirth: "",
      isActive: true,
      emailVerified: false,
    },
  });

  // Reset form when dialog opens/closes or customer changes
  useEffect(() => {
    if (open) {
      if (currentCustomer) {
        form.reset({
          email: currentCustomer.email,
          firstName: currentCustomer.firstName || "",
          lastName: currentCustomer.lastName || "",
          phoneNumber: currentCustomer.phoneNumber || "",
          address: currentCustomer.address || "",
          dateOfBirth: currentCustomer.dateOfBirth || "",
          isActive: currentCustomer.isActive ?? true,
          emailVerified: currentCustomer.emailVerified ?? false,
        });
      } else {
        form.reset({
          email: "",
          firstName: "",
          lastName: "",
          phoneNumber: "",
          address: "",
          dateOfBirth: "",
          isActive: true,
          emailVerified: false,
        });
      }
    }
  }, [open, currentCustomer, form]);

  const handleSubmit = async (values: CustomerFormValues) => {
    try {
      await userService.update(currentCustomer.id, values);
      toast.success("Đã cập nhật khách hàng thành công");

      // Invalidate and refetch customers data
      await queryClient.invalidateQueries({
        queryKey: ["customers", "list"],
      });

      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast.error(error?.message || "Không thể cập nhật khách hàng");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-2xl">
        <SheetHeader className="text-start">
          <SheetTitle>Chỉnh sửa khách hàng</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            id="customers-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex-1 space-y-6 overflow-y-auto px-4 pb-6"
          >
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thông tin cơ bản</h3>
              <div className="rounded-lg border bg-card p-4 space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="Nhập email" disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nhập tên" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nhập họ" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nhập số điện thoại" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày sinh</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Nhập địa chỉ" className="min-h-[80px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Trạng thái</h3>
              <div className="rounded-lg border bg-card p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <FormField
                    control={form.control}
                    name="emailVerified"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>Email đã xác thực</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </form>
        </Form>

        <SheetFooter className="gap-2">
          <Button form="customers-form" type="submit">
            Cập nhật
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
