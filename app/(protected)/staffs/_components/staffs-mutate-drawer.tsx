"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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

import { formatDateForInput, parseDateFromInput } from "@/schemas/coupons";
import { StaffFormValues, staffSchema, updateStaffSchema } from "@/schemas/staffs";
import { userService } from "@/services/userService";
import { RolesEnum } from "@/types/enums";
import { IUser } from "@/types/user";
import { Loader2 } from "lucide-react";

interface StaffsMutateDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStaff: IUser | null;
}

export function StaffsMutateDrawer({ open, onOpenChange, currentStaff }: StaffsMutateDrawerProps) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const isUpdate = !!currentStaff;

  const form = useForm<StaffFormValues>({
    resolver: zodResolver((isUpdate ? updateStaffSchema : staffSchema) as any),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      dateOfBirth: "",
      roles: [],
      isActive: true,
      emailVerified: false,
    },
  });

  // Reset form when dialog opens/closes or staff changes
  useEffect(() => {
    if (open) {
      if (currentStaff) {
        form.reset({
          email: currentStaff.email,
          password: "", // Password not shown when updating
          firstName: currentStaff.firstName || "",
          lastName: currentStaff.lastName || "",
          phoneNumber: currentStaff.phoneNumber || "",
          address: currentStaff.address || "",
          dateOfBirth: currentStaff.dateOfBirth || "",
          roles: currentStaff.roles?.map((role) => role.name) || [],
          isActive: currentStaff.isActive ?? true,
          emailVerified: currentStaff.emailVerified ?? false,
        });
      } else {
        form.reset({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          phoneNumber: "",
          address: "",
          dateOfBirth: "",
          roles: [],
          isActive: true,
          emailVerified: false,
        });
      }
    }
  }, [open, currentStaff, form]);

  const handleSubmit = async (values: StaffFormValues) => {
    setLoading(true);
    try {
      // Convert roles array to proper format for backend
      // Backend expects Set<String> (array of strings), not IRole[] objects
      const submitData = {
        ...values,
        firstName: values.firstName || undefined,
        lastName: values.lastName || undefined,
        phoneNumber: values.phoneNumber || undefined,
        address: values.address || undefined,
        dateOfBirth: values.dateOfBirth || undefined,
        password: values.password || undefined, // Only sent when creating
        roles: values.roles, // Backend expects string[], not IRole[] objects
      };

      if (isUpdate && currentStaff) {
        // Remove password when updating (backend doesn't expect it)
        const { password, ...updateData } = submitData;
        // Type assertion needed: backend accepts string[] for roles, but IUser type has IRole[]
        await userService.update(currentStaff.id, updateData as any);
        toast.success("Đã cập nhật nhân viên thành công");
      } else {
        // Type assertion needed: backend accepts string[] for roles, but IUser type has IRole[]
        await userService.create(submitData as any);
        toast.success("Đã thêm nhân viên thành công");
      }

      // Invalidate and refetch staffs data
      await queryClient.invalidateQueries({
        queryKey: ["staffs", "list"],
      });

      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast.error(error?.message || `Không thể ${isUpdate ? "cập nhật" : "thêm"} nhân viên`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-2xl">
        <SheetHeader className="text-start">
          <SheetTitle>{isUpdate ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            id="staffs-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex-1 space-y-6 overflow-y-auto px-4 pb-6"
          >
            {/* Account Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thông tin tài khoản</h3>
              <div className="rounded-lg border bg-card p-4 space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Nhập email"
                          disabled={isUpdate}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {!isUpdate && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" placeholder="Nhập mật khẩu" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thông tin cơ bản</h3>
              <div className="rounded-lg border bg-card p-4 space-y-4">
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
                          <Input
                            type="date"
                            value={formatDateForInput(field.value)}
                            onChange={(e) => field.onChange(parseDateFromInput(e.target.value))}
                          />
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

            {/* Role & Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Vai trò & Trạng thái</h3>
              <div className="rounded-lg border bg-card p-4 space-y-4">
                <FormField
                  control={form.control}
                  name="roles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vai trò</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.[0] || ""}
                          onValueChange={(value) => field.onChange([value])}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn vai trò" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={RolesEnum.ADMIN}>Quản trị viên</SelectItem>
                            <SelectItem value={RolesEnum.STAFF}>Nhân viên</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
          <Button form="staffs-form" type="submit">
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : isUpdate ? (
              "Cập nhật"
            ) : (
              "Thêm nhân viên"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
