"use client";

import { CustomersDialogs } from "./_components/customers-dialogs";
import { CustomersProvider } from "./_components/customers-provider";
import { CustomersTable } from "./_components/customers-table";

export default function CustomersPage() {
  return (
    <CustomersProvider>
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Khách hàng</h2>
            <p className="text-muted-foreground">Quản lý danh sách khách hàng của bạn.</p>
          </div>
        </div>
        <CustomersTable />
      </div>

      <CustomersDialogs />
    </CustomersProvider>
  );
}
