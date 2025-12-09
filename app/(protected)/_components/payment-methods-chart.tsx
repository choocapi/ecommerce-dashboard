"use client";

import { Loader } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface PaymentMethodsChartProps {
  data?: Record<string, number>;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function PaymentMethodsChart({ data }: PaymentMethodsChartProps) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const chartData = Object.entries(data).map(([name, value]) => ({
    name:
      name === "COD"
        ? "COD"
        : name === "VNPAY"
        ? "VNPay"
        : name === "MOMO"
        ? "MoMo"
        : name === "ZALOPAY"
        ? "ZaloPay"
        : name,
    value,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
        Chưa có dữ liệu
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [
            new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value),
            "Doanh thu",
          ]}
          contentStyle={{
            borderRadius: "8px",
            border: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
