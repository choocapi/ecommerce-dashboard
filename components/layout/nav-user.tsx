"use client";

import ChangePasswordModal from "@/components/shared/profile/change-password-modal";
import { SignOutDialog } from "@/components/shared/sign-out-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useDialogState from "@/hooks/use-dialog-state";
import { IUser } from "@/types/user";
import { getUserFullName } from "@/utils";
import { ChevronsUpDown, Lock, LogOut, UserCog } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type NavUserProps = {
  user: IUser | undefined;
};

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar();
  const [signOutOpen, setSignOutOpen] = useDialogState();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user?.avatarUrl || ""}
                    alt={getUserFullName(user || undefined)}
                  />
                  <AvatarFallback className="rounded-lg">SN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-start text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {getUserFullName(user || undefined)}
                  </span>
                  <span className="truncate text-xs">{user?.email || ""}</span>
                </div>
                <ChevronsUpDown className="ms-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={user?.avatarUrl || ""}
                      alt={getUserFullName(user || undefined)}
                    />
                    <AvatarFallback className="rounded-lg">SN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-start text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {getUserFullName(user || undefined)}
                    </span>
                    <span className="truncate text-xs">{user?.email || ""}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/settings/profile">
                    <UserCog />
                    Hồ sơ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChangePasswordOpen(true)}>
                  <Lock />
                  Đổi mật khẩu
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setSignOutOpen(true)}>
                <LogOut />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <ChangePasswordModal
        isOpen={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
      <SignOutDialog open={!!signOutOpen} onOpenChange={setSignOutOpen} />
    </>
  );
}
