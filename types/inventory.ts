import type { InventoryTransactionType } from './enums';
import { IProduct } from './products';
import { ISupplier } from './supplier';

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
