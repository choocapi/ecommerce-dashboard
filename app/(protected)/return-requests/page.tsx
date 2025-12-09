"use client";

import { ReturnRequestsDialogs } from "./_components/return-requests-dialogs";
import { ReturnRequestsProvider } from "./_components/return-requests-provider";
import { ReturnRequestsTable } from "./_components/return-requests-table";

export default function ReturnRequestsPage() {
  return (
    <ReturnRequestsProvider>
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Yêu cầu trả hàng</h2>
          <p className="text-muted-foreground">Quản lý các yêu cầu trả hàng từ khách hàng.</p>
        </div>
        <ReturnRequestsTable />
      </div>

      <ReturnRequestsDialogs />
    </ReturnRequestsProvider>
  );
}
