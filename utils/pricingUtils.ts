export const calculateDiscountedPrice = (originalPrice?: number, discountPercentage?: number): number => {
  if (!originalPrice || originalPrice <= 0) return 0;
  if (!discountPercentage || discountPercentage <= 0) {
    return originalPrice;
  }
  const discounted = originalPrice - (originalPrice * discountPercentage) / 100;
  return discounted > 0 ? Number(discounted.toFixed(0)) : 0;
};

export const deriveDiscountPercentage = (price?: number, originalPrice?: number): number => {
  if (!originalPrice || originalPrice <= 0) return 0;
  if (!price || price >= originalPrice) return 0;
  const diff = originalPrice - price;
  return Math.round((diff / originalPrice) * 100);
};
