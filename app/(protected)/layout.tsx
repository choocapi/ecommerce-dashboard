"use client";

import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
import { useAuthStore } from "@/stores/useAuthStore";
import { canView, isAdminOrStaff } from "@/utils/permissions";
import { getFeatureForRoute } from "@/utils/route-permissions";
import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import Loading from "../loading";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, accessToken, initialize, isLoading } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      initialize().finally(() => {
        setIsInitialized(true);
      });
    }
  }, [initialize, isInitialized]);

  useEffect(() => {
    if (!isInitialized || isLoading) return;

    if (!accessToken || !user) {
      window.location.href = `/login?redirect=${encodeURIComponent(pathname)}`;
      return;
    }

    if (!isAdminOrStaff(user)) {
      useAuthStore.getState().clearState();
      window.location.href = `/login?redirect=${encodeURIComponent(pathname)}`;
      return;
    }

    // Check route permissions
    const feature = getFeatureForRoute(pathname);
    if (feature && !canView(user, feature)) {
      // User doesn't have VIEW permission for this route
      window.location.href = "/";
      return;
    }
  }, [user, accessToken, isLoading, isInitialized, pathname]);

  if (!isInitialized || isLoading || !accessToken || !user) {
    return <Loading />;
  }

  if (!isAdminOrStaff(user)) {
    return <Loading />;
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
