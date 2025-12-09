"use client";

import type { ICategorySales } from "@/types/statistics";

interface CategoryPerformanceChartProps {
  data?: ICategorySales[];
}

export function CategoryPerformanceChart({ data }: CategoryPerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        Chưa có dữ liệu
      </div>
    );
  }

  const max = Math.max(...data.map((i) => i.totalRevenue), 1);
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  return (
    <ul className="space-y-3">
      {data.map((item) => {
        const width = `${Math.round((item.totalRevenue / max) * 100)}%`;
        return (
          <li key={item.categoryName} className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-muted-foreground mb-1 truncate text-xs">{item.categoryName}</div>
              <div className="bg-muted h-2.5 w-full rounded-full">
                <div className="h-2.5 rounded-full bg-primary" style={{ width }} />
              </div>
            </div>
            <div className="ps-2 text-xs font-medium tabular-nums">
              {formatCurrency(item.totalRevenue)} ₫
            </div>
          </li>
        );
      })}
    </ul>
  );
}
