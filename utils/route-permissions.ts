import { Feature } from "@/config/permissions-config";

/**
 * Route to Feature mapping
 * Maps protected routes to their corresponding feature for permission checking
 */
export const ROUTE_PERMISSIONS: Record<string, Feature> = {
  "/": Feature.PRODUCTS, // Dashboard - use products as default
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
 * Get feature for a given route path
 */
export function getFeatureForRoute(pathname: string): Feature | null {
  // Exact match first
  if (ROUTE_PERMISSIONS[pathname]) {
    return ROUTE_PERMISSIONS[pathname];
  }

  // Check for nested routes (e.g., /products/123)
  for (const [route, feature] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname.startsWith(route + "/") || pathname.startsWith(route + "?")) {
      return feature;
    }
  }

  return null;
}
