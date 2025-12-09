"use client";

import Loader from "@/components/common/loader";
import AvatarUpload from "@/components/shared/profile/avatar-upload";
import ChangePasswordModal from "@/components/shared/profile/change-password-modal";
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
import { Textarea } from "@/components/ui/textarea";
import { profileSchema, type ProfileFormValues } from "@/schemas/profile";
import { userService } from "@/services/userService";
import { useAuthStore } from "@/stores/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Calendar, Mail, MapPin, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ProfileSettingsPage() {
  const { user, refreshUser } = useAuthStore();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      dateOfBirth: "",
      address: "",
      avatarUrl: "",
    },
  });

  useEffect(() => {
    if (user) {
      // Format dateOfBirth from ISO string to YYYY-MM-DD format for form
      const dateOfBirth = user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "";

      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
        email: user.email || "",
        dateOfBirth: dateOfBirth,
        address: user.address || "",
        avatarUrl: user.avatarUrl || "",
      });
    }
  }, [user, form]);

  // Mutation để update avatar
  const updateAvatarMutation = useMutation({
    mutationFn: (avatarUrl: string) => userService.updateMyProfile({ avatarUrl }),
    onSuccess: async (_, avatarUrl) => {
      await refreshUser();
      form.setValue("avatarUrl", avatarUrl);
      toast.success("Cập nhật ảnh đại diện thành công!");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Cập nhật ảnh đại diện thất bại!");
    },
  });

  // Mutation để update profile
  const updateProfileMutation = useMutation({
    mutationFn: (values: ProfileFormValues) =>
      userService.updateMyProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber || undefined,
        dateOfBirth: values.dateOfBirth || undefined,
        address: values.address || undefined,
      }),
    onSuccess: async () => {
      await refreshUser();
      toast.success("Cập nhật thông tin thành công!");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Cập nhật thông tin thất bại!");
    },
  });

  const handleAvatarUpload = (avatarUrl: string) => {
    updateAvatarMutation.mutate(avatarUrl);
  };

  const onSubmit = (values: ProfileFormValues) => {
    updateProfileMutation.mutate(values);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Thông tin tài khoản</h2>
          <p className="text-muted-foreground">Quản lý thông tin cá nhân và cài đặt tài khoản.</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Section */}
            <div className="shrink-0">
              <AvatarUpload
                currentAvatarUrl={user.avatarUrl}
                firstName={user.firstName}
                lastName={user.lastName}
                onUploadComplete={handleAvatarUpload}
                disabled={updateAvatarMutation.isPending || updateProfileMutation.isPending}
              />
            </div>

            {/* Form Section */}
            <div className="flex-1">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Họ</FormLabel>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <FormControl>
                              <Input {...field} className="pl-10" placeholder="Nhập họ" />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên</FormLabel>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <FormControl>
                              <Input {...field} className="pl-10" placeholder="Nhập tên" />
                            </FormControl>
                          </div>
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
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <FormControl>
                              <Input
                                {...field}
                                type="tel"
                                className="pl-10"
                                placeholder="Nhập số điện thoại"
                              />
                            </FormControl>
                          </div>
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
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                            <FormControl>
                              <Input
                                {...field}
                                type="date"
                                className="pl-10"
                                max={new Date().toISOString().split("T")[0]}
                                min="1900-01-01"
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              disabled
                              className="pl-10 bg-muted cursor-not-allowed"
                              placeholder="Email"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ</FormLabel>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Textarea
                              {...field}
                              className="pl-10 min-h-[100px] resize-none"
                              placeholder="Nhập địa chỉ"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending || updateAvatarMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsPasswordDialogOpen(true)}
                    >
                      Đổi mật khẩu
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
      />
    </>
  );
}
