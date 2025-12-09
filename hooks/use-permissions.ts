import { Feature, PermissionType } from "@/config/permissions-config";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  canCreate,
  canDelete,
  canUpdate,
  canView,
  hasPermission as checkPermission,
  isAdmin,
  isStaff,
} from "@/utils/permissions";
import { useMemo } from "react";

/**
 * Hook to check user permissions
 * Memoized for performance optimization
 */
export function usePermissions() {
  const { user } = useAuthStore();

  return useMemo(
    () => ({
      // Basic role checks
      isAdmin: isAdmin(user),
      isStaff: isStaff(user),

      // Permission checks by feature and type
      hasPermission: (feature: Feature, permissionType: PermissionType) =>
        checkPermission(user, feature, permissionType),
      canView: (feature: Feature) => canView(user, feature),
      canCreate: (feature: Feature) => canCreate(user, feature),
      canUpdate: (feature: Feature) => canUpdate(user, feature),
      canDelete: (feature: Feature) => canDelete(user, feature),
    }),
    [user],
  );
}
