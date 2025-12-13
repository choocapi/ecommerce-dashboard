import { Feature, PERMISSIONS_CONFIG, PermissionType } from "@/config/permissions-config";
import { RolesEnum } from "@/types/enums";
import { IUser } from "@/types/user";

export const hasRole = (user: IUser | null, role: string): boolean => {
  if (!user?.roles) return false;
  return user.roles.some((r) => r.name === role);
};

export const isAdmin = (user: IUser | null): boolean => {
  return hasRole(user, RolesEnum.ADMIN);
};

export const isStaff = (user: IUser | null): boolean => {
  return hasRole(user, RolesEnum.STAFF);
};

export const isAdminOrStaff = (user: IUser | null): boolean => {
  return isAdmin(user) || isStaff(user);
};

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

export const canView = (user: IUser | null, feature: Feature): boolean => {
  return hasPermission(user, feature, PermissionType.VIEW);
};

export const canCreate = (user: IUser | null, feature: Feature): boolean => {
  return hasPermission(user, feature, PermissionType.CREATE);
};

export const canUpdate = (user: IUser | null, feature: Feature): boolean => {
  return hasPermission(user, feature, PermissionType.UPDATE);
};

export const canDelete = (user: IUser | null, feature: Feature): boolean => {
  return hasPermission(user, feature, PermissionType.DELETE);
};
