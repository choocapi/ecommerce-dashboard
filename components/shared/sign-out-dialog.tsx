"use client";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SignOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await logout();
    } catch (error) {
      useAuthStore.getState().clearState();
    } finally {
      setIsLoading(false);
      onOpenChange(false);

      const currentPath = pathname;
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Đăng xuất"
      desc="Bạn có chắc chắn muốn đăng xuất không?"
      confirmText={isLoading ? "Đăng xuất..." : "Đăng xuất"}
      destructive
      handleConfirm={handleSignOut}
      className="sm:max-w-sm"
      disabled={isLoading}
    />
  );
}
