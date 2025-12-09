import { Feature } from "@/config/permissions-config";
import { IUser } from "@/types/user";
import { canView } from "./permissions";

/**
 * Route to Feature mapping for sidebar items
 */
const SIDEBAR_ROUTE_FEATURES: Record<string, Feature> = {
  "/": Feature.PRODUCTS, // Dashboard
  "/products": Feature.PRODUCTS,
  "/categories": Feature.CATEGORIES,
  "/brands": Feature.BRANDS,
  "/suppliers": Feature.SUPPLIERS,
  "/orders": Feature.ORDERS,
  "/return-requests": Feature.RETURN_REQUESTS,
  "/inventory": Feature.INVENTORY,
  "/customers": Feature.CUSTOMERS,
  "/staffs": Feature.STAFFS,
  "/banners": Feature.BANNERS,
  "/articles": Feature.ARTICLES,
  "/coupons": Feature.COUPONS,
  "/settings/profile": Feature.PROFILE,
  "/settings/system": Feature.SYSTEM_SETTINGS,
};

/**
 * Check if user can view a sidebar item by its URL
 */
export function canViewSidebarItem(user: IUser | null, url: string): boolean {
  const feature = SIDEBAR_ROUTE_FEATURES[url];
  if (!feature) {
    // If no feature mapping, allow by default (e.g., help-center)
    return true;
  }
  return canView(user, feature);
}

/**
 * Filter sidebar items recursively based on VIEW permissions
 */
export function filterSidebarItemsByPermission<T extends { url?: string; items?: T[] }>(
  items: T[],
  user: IUser | null,
): T[] {
  return items
    .map((item) => {
      // If item has URL, check permission
      if (item.url && !canViewSidebarItem(user, item.url)) {
        return null;
      }

      // If item has sub-items, filter them recursively
      if (item.items && item.items.length > 0) {
        const filteredSubItems = filterSidebarItemsByPermission(item.items, user);
        // If no sub-items remain and no URL, hide the parent
        if (filteredSubItems.length === 0 && !item.url) {
          return null;
        }
        return {
          ...item,
          items: filteredSubItems,
        };
      }

      return item;
    })
    .filter((item): item is T => item !== null);
}
