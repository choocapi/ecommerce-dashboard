import { Feature } from "@/config/permissions-config";
import { usePermissions } from "./use-permissions";

/**
 * Hook to get all permissions for a specific feature
 * Useful for components that need to check multiple permissions for one feature
 */
export function useFeaturePermissions(feature: Feature) {
  const { canView, canCreate, canUpdate, canDelete } = usePermissions();

  return {
    canView: canView(feature),
    canCreate: canCreate(feature),
    canUpdate: canUpdate(feature),
    canDelete: canDelete(feature),
  };
}

