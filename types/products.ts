import { IUser } from "./user";

export interface IProduct {
  id: number;
  sku: string;
  name: string;
  slug: string;
  description?: string; // HTML
  imageUrls?: string; // JSON string array: ["url1", "url2", ...]
  price: number;
  originalPrice?: number;
  importPrice?: number;
  categoryId?: number;
  category?: ICategory;
  brandId?: number;
  brand?: IBrand;
  specifications?: string; // JSON string
  quantity?: number;
  reservedQuantity?: number;
  isPublished?: boolean;
  publishedAt?: string;
  isFeatured?: boolean;
  averageRating?: number;
  reviewCount?: number;
}

// Helper function to parse imageUrls JSON string to array
export const parseImageUrls = (imageUrls?: string): string[] => {
  if (!imageUrls) return [];
  try {
    const parsed = JSON.parse(imageUrls);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// Helper function to get primary/first image URL
export const getProductImageUrl = (product: IProduct): string | undefined => {
  const urls = parseImageUrls(product.imageUrls);
  return urls.length > 0 ? urls[0] : undefined;
};

export const getProductDiscountPercentage = (product: IProduct): number => {
  if (!product.originalPrice || product.originalPrice <= 0) return 0;
  if (!product.price || product.price >= product.originalPrice) return 0;
  const diff = product.originalPrice - product.price;
  return Math.round((diff / product.originalPrice) * 100);
};

// Helper function to parse specifications JSON string to object
export const parseSpecifications = (specifications?: string): Record<string, string> => {
  if (!specifications) return {};
  try {
    const parsed = JSON.parse(specifications);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
};

export interface ICategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
  parentId?: number;
  parent?: ICategory;
}

export interface IBrand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  isActive?: boolean;
}

export interface IProductReview {
  id: number;
  productId?: number;
  product?: IProduct;
  userId?: string; // UUID
  user?: IUser;
  imageUrls?: string; // JSON string array: ["url1", "url2", ...]
  rating: number; // 1..5
  content?: string;
  isPurchased?: boolean;
  isHidden?: boolean;
  createdAt?: string;
}

export const getProductStatusVariant = (isPublished: boolean) => {
  if (isPublished) return "default";
  if (!isPublished) return "secondary";
  return "outline";
};

export const getQuantityVariant = (quantity: number) => {
  if (quantity <= 0) return "destructive";
  if (quantity <= 3) return "secondary";
  return "default";
};
