import { RolesEnum } from "@/types/enums";

export enum PermissionType {
  VIEW = "VIEW",
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export enum Feature {
  // Products
  PRODUCTS = "PRODUCTS",
  CATEGORIES = "CATEGORIES",
  BRANDS = "BRANDS",

  // Sales
  ORDERS = "ORDERS",
  RETURN_REQUESTS = "RETURN_REQUESTS",

  // Inventory
  INVENTORY = "INVENTORY",
  SUPPLIERS = "SUPPLIERS",

  // Customers
  CUSTOMERS = "CUSTOMERS",

  // Staff
  STAFFS = "STAFFS",

  // Marketing
  BANNERS = "BANNERS",
  ARTICLES = "ARTICLES",
  COUPONS = "COUPONS",

  // Settings
  PROFILE = "PROFILE",
  SYSTEM_SETTINGS = "SYSTEM_SETTINGS",
}

type RoleArray = readonly (
  | typeof RolesEnum.ADMIN
  | typeof RolesEnum.STAFF
  | typeof RolesEnum.CUSTOMER
)[];

type FeaturePermissionConfig = {
  readonly [K in PermissionType]: RoleArray;
};

export const PERMISSIONS_CONFIG: Record<Feature, FeaturePermissionConfig> = {
  [Feature.PRODUCTS]: {
    [PermissionType.VIEW]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
    [PermissionType.CREATE]: [RolesEnum.ADMIN] as const,
    [PermissionType.UPDATE]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
    [PermissionType.DELETE]: [RolesEnum.ADMIN] as const,
  },

  [Feature.CATEGORIES]: {
    [PermissionType.VIEW]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
    [PermissionType.CREATE]: [RolesEnum.ADMIN] as const,
    [PermissionType.UPDATE]: [RolesEnum.ADMIN] as const,
    [PermissionType.DELETE]: [RolesEnum.ADMIN] as const,
  },

  [Feature.BRANDS]: {
    [PermissionType.VIEW]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
    [PermissionType.CREATE]: [RolesEnum.ADMIN] as const,
    [PermissionType.UPDATE]: [RolesEnum.ADMIN] as const,
    [PermissionType.DELETE]: [RolesEnum.ADMIN] as const,
  },

  [Feature.SUPPLIERS]: {
    [PermissionType.VIEW]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
    [PermissionType.CREATE]: [RolesEnum.ADMIN] as const,
    [PermissionType.UPDATE]: [RolesEnum.ADMIN] as const,
    [PermissionType.DELETE]: [RolesEnum.ADMIN] as const,
  },

  [Feature.ORDERS]: {
    [PermissionType.VIEW]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
    [PermissionType.CREATE]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
    [PermissionType.UPDATE]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
    [PermissionType.DELETE]: [RolesEnum.ADMIN] as const,
  },

  [Feature.RETURN_REQUESTS]: {
    [PermissionType.VIEW]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
    [PermissionType.CREATE]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
    [PermissionType.UPDATE]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
    [PermissionType.DELETE]: [RolesEnum.ADMIN] as const,
  },

  [Feature.INVENTORY]: {
    [PermissionType.VIEW]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
    [PermissionType.CREATE]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
    [PermissionType.UPDATE]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
    [PermissionType.DELETE]: [RolesEnum.ADMIN] as const,
  },

  [Feature.CUSTOMERS]: {
    [PermissionType.VIEW]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
    [PermissionType.CREATE]: [RolesEnum.ADMIN] as const,
    [PermissionType.UPDATE]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
    [PermissionType.DELETE]: [RolesEnum.ADMIN] as const,
  },

  [Feature.STAFFS]: {
    [PermissionType.VIEW]: [RolesEnum.ADMIN] as const,
    [PermissionType.CREATE]: [RolesEnum.ADMIN] as const,
    [PermissionType.UPDATE]: [RolesEnum.ADMIN] as const,
    [PermissionType.DELETE]: [RolesEnum.ADMIN] as const,
  },

  [Feature.BANNERS]: {
    [PermissionType.VIEW]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
    [PermissionType.CREATE]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
    [PermissionType.UPDATE]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
    [PermissionType.DELETE]: [RolesEnum.ADMIN] as const,
  },

  [Feature.ARTICLES]: {
    [PermissionType.VIEW]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
    [PermissionType.CREATE]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
    [PermissionType.UPDATE]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
    [PermissionType.DELETE]: [RolesEnum.ADMIN] as const,
  },

  [Feature.COUPONS]: {
    [PermissionType.VIEW]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
    [PermissionType.CREATE]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
    [PermissionType.UPDATE]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
    [PermissionType.DELETE]: [RolesEnum.ADMIN] as const,
  },

  [Feature.PROFILE]: {
    [PermissionType.VIEW]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
    [PermissionType.CREATE]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
    [PermissionType.UPDATE]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
    [PermissionType.DELETE]: [RolesEnum.ADMIN, RolesEnum.STAFF] as const,
  },

  [Feature.SYSTEM_SETTINGS]: {
    [PermissionType.VIEW]: [RolesEnum.ADMIN] as const,
    [PermissionType.CREATE]: [RolesEnum.ADMIN] as const,
    [PermissionType.UPDATE]: [RolesEnum.ADMIN] as const,
    [PermissionType.DELETE]: [RolesEnum.ADMIN] as const,
  },
} as const;

/**
 * Validate permissions config at runtime
 * Ensures all features have all permission types defined
 */
if (typeof window === "undefined") {
  // Only validate in development/build time
  const allFeatures = Object.values(Feature);
  const allPermissionTypes = Object.values(PermissionType);

  for (const feature of allFeatures) {
    const config = PERMISSIONS_CONFIG[feature];
    if (!config) {
      console.error(`[Permissions] Missing config for feature: ${feature}`);
      continue;
    }

    for (const permissionType of allPermissionTypes) {
      if (!config[permissionType] || config[permissionType].length === 0) {
        console.warn(
          `[Permissions] Feature ${feature} missing or empty ${permissionType} permission`,
        );
      }
    }
  }
}
