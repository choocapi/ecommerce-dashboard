"use client";

import { Badge } from "@/components/ui/badge";
import type { IInventoryTransactionStatistics } from "@/types/statistics";
import { formatCurrency, formatDateTime } from "@/utils";
import { Package } from "lucide-react";

interface RecentInventoryTransactionsProps {
  data?: IInventoryTransactionStatistics[];
}

export function RecentInventoryTransactions({ data }: RecentInventoryTransactionsProps) {
  if (!data || data.length === 0) {
    return <div className="text-center text-muted-foreground py-8">Chưa có giao dịch nào</div>;
  }

  const getTypeVariant = (type: string) => {
    switch (type) {
      case "IN":
        return "default";
      case "OUT":
        return "destructive";
      case "ADJUST":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "IN":
        return "Nhập kho";
      case "OUT":
        return "Xuất kho";
      case "ADJUST":
        return "Điều chỉnh";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-2">
      {data.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
        >
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Package className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-1 flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate">{transaction.productName}</p>
              <Badge variant={getTypeVariant(transaction.type)} className="shrink-0">
                {getTypeLabel(transaction.type)}
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">{formatDateTime(transaction.createdAt)}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-sm font-medium">x{transaction.quantity}</div>
            {transaction.price && (
              <div className="text-xs text-muted-foreground">
                {formatCurrency(transaction.price)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
