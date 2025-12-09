import { Feature, PERMISSIONS_CONFIG, PermissionType } from "@/config/permissions-config";
import { RolesEnum } from "@/types/enums";
import { IUser } from "@/types/user";

/**
 * Check if user has a specific role
 */
export const hasRole = (user: IUser | null, role: string): boolean => {
  if (!user?.roles) return false;
  return user.roles.some((r) => r.name === role);
};

/**
 * Check if user is Admin
 */
export const isAdmin = (user: IUser | null): boolean => {
  return hasRole(user, RolesEnum.ADMIN);
};

/**
 * Check if user is Staff
 */
export const isStaff = (user: IUser | null): boolean => {
  return hasRole(user, RolesEnum.STAFF);
};

/**
 * Check if user is Admin or Staff
 */
export const isAdminOrStaff = (user: IUser | null): boolean => {
  return isAdmin(user) || isStaff(user);
};

/**
 * Check if user has permission for a specific feature and permission type
 */
export const hasPermission = (
  user: IUser | null,
  feature: Feature,
  permissionType: PermissionType,
): boolean => {
  if (!user?.roles || user.roles.length === 0) {
    return false;
  }

  const config = PERMISSIONS_CONFIG[feature];
  if (!config) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[Permissions] Config not found for feature: ${feature}`);
    }
    return false;
  }

  const allowedRoles = config[permissionType];
  if (!allowedRoles || allowedRoles.length === 0) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[Permissions] Permission ${permissionType} not configured for feature: ${feature}`,
      );
    }
    return false;
  }

  const userRoles = user.roles.map((r) => r.name);
  return allowedRoles.some((role) => userRoles.includes(role));
};

/**
 * Check if user can view a feature (VIEW permission)
 */
export const canView = (user: IUser | null, feature: Feature): boolean => {
  return hasPermission(user, feature, PermissionType.VIEW);
};

/**
 * Check if user can create in a feature (CREATE permission)
 */
export const canCreate = (user: IUser | null, feature: Feature): boolean => {
  return hasPermission(user, feature, PermissionType.CREATE);
};

/**
 * Check if user can update in a feature (UPDATE permission)
 */
export const canUpdate = (user: IUser | null, feature: Feature): boolean => {
  return hasPermission(user, feature, PermissionType.UPDATE);
};

/**
 * Check if user can delete in a feature (DELETE permission)
 */
export const canDelete = (user: IUser | null, feature: Feature): boolean => {
  return hasPermission(user, feature, PermissionType.DELETE);
};
