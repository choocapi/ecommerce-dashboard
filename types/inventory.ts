import { InventoryTransactionTypeEnum, type InventoryTransactionType } from "./enums";
import { IProduct } from "./products";
import { ISupplier } from "./supplier";

export interface IInventoryTransaction {
  id: number;
  productId?: number;
  product?: IProduct;
  supplierId?: number;
  supplier?: ISupplier;
  orderId?: string; // UUID
  type: InventoryTransactionType;
  quantity: number;
  price?: number;
  previousQuantity?: number;
  resultingQuantity?: number;
  targetQuantity?: number;
  note?: string;
  createdAt?: string;
}

export const getTypeVariant = (type: string) => {
  switch (type) {
    case InventoryTransactionTypeEnum.IN:
      return "default";
    case InventoryTransactionTypeEnum.OUT:
      return "destructive";
    case InventoryTransactionTypeEnum.ADJUST:
      return "secondary";
    default:
      return "outline";
  }
};

export const getTypeLabel = (type: string) => {
  switch (type) {
    case InventoryTransactionTypeEnum.IN:
      return "Nhập kho";
    case InventoryTransactionTypeEnum.OUT:
      return "Xuất kho";
    case InventoryTransactionTypeEnum.ADJUST:
      return "Điều chỉnh";
    default:
      return type;
  }
};
