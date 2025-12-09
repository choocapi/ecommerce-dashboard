"use client";

import { PasswordInput } from "@/components/shared/password-input";
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
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { isAdminOrStaff } from "@/utils/permissions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === "" ? "Vui lòng nhập email" : undefined),
  }),
  password: z.string().min(1, "Vui lòng nhập mật khẩu").min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string;
}

export function UserAuthForm({ className, redirectTo, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      await login(data.email, data.password);

      const user = useAuthStore.getState().user;
      if (!user) {
        toast.error("Không thể lấy thông tin người dùng");
        setIsLoading(false);
        return;
      }

      if (!isAdminOrStaff(user)) {
        await useAuthStore.getState().logout();
        toast.error("Bạn không có quyền truy cập. Chỉ Admin và Staff mới được phép đăng nhập.");
        setIsLoading(false);
        return;
      }

      const redirectPath = redirectTo || searchParams.get("redirect") || "/";
      router.push(redirectPath);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid gap-3", className)}
        {...props}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="nguyen@gmail.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-2" disabled={isLoading} type="submit">
          {isLoading ? <Loader2 className="animate-spin" /> : <LogIn />}
          Đăng nhập
        </Button>
      </form>
    </Form>
  );
}
