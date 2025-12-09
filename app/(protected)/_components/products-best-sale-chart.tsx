"use client";

import type { IProductSales } from "@/types/statistics";

interface ProductsBestSaleChartProps {
  data?: IProductSales[];
}

export function ProductsBestSaleChart({ data }: ProductsBestSaleChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        Chưa có dữ liệu
      </div>
    );
  }

  const max = Math.max(...data.map((i) => i.totalQuantity), 1);

  return (
    <ul className="space-y-3">
      {data.map((item) => {
        const width = `${Math.round((item.totalQuantity / max) * 100)}%`;
        return (
          <li key={item.productName} className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-muted-foreground mb-1 truncate text-xs">{item.productName}</div>
              <div className="bg-muted h-2.5 w-full rounded-full">
                <div className="h-2.5 rounded-full bg-primary" style={{ width }} />
              </div>
            </div>
            <div className="ps-2 text-xs font-medium tabular-nums">{item.totalQuantity}</div>
          </li>
        );
      })}
    </ul>
  );
}
