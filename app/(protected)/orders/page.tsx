"use client";

import { OrdersDialogs } from "./_components/orders-dialogs";
import { OrdersPrimaryButtons } from "./_components/orders-primary-buttons";
import { OrdersProvider } from "./_components/orders-provider";
import { OrdersTable } from "./_components/orders-table";

export default function OrdersPage() {
  return (
    <OrdersProvider>
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Đơn hàng</h2>
            <p className="text-muted-foreground">Quản lý danh sách đơn hàng của bạn.</p>
          </div>
          <OrdersPrimaryButtons />
        </div>
        <OrdersTable />
      </div>

      <OrdersDialogs />
    </OrdersProvider>
  );
}
