"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { UserAuthForm } from "./_components/user-auth-form";

export default function LoginPage() {
  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="flex justify-center">
          <Image
            src="/logo.svg"
            alt="ACB Computer Logo"
            width={120}
            height={60}
            className="h-12 w-auto"
            priority
          />
        </div>
        <CardTitle className="text-center">Đăng nhập</CardTitle>
        <CardDescription className="text-center">Đăng nhập vào trang quản trị</CardDescription>
      </CardHeader>
      <CardContent>
        <UserAuthForm />
      </CardContent>
    </Card>
  );
}
