"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { CommandMenu } from "@/components/shared/command-menu";
import { SkipToMain } from "@/components/shared/skip-to-main";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Search } from "../shared/search";
import { ThemeSwitch } from "../shared/theme-switch";
import { Header } from "./header";
import { Main } from "./main";

type AuthenticatedLayoutProps = {
  children?: React.ReactNode;
};

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <SidebarProvider>
      <SkipToMain />
      <AppSidebar />
      <SidebarInset
        className={cn(
          // Set content container, so we can use container queries
          "@container/content",

          // If layout is fixed, set the height
          // to 100svh to prevent overflow
          "has-data-[layout=fixed]:h-svh",

          // If layout is fixed and sidebar is inset,
          // set the height to 100svh - spacing (total margins) to prevent overflow
          "peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]",
        )}
      >
        <Header>
          <Search />
          <div className="ms-auto flex items-center space-x-4">
            <ThemeSwitch />
          </div>
        </Header>
        <Main>{children}</Main>
      </SidebarInset>
      <CommandMenu />
    </SidebarProvider>
  );
}
