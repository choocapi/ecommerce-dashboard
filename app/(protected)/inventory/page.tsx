"use client";

import { InventoryProvider } from './_components/inventory-provider'
import { InventoryPrimaryButtons } from './_components/inventory-primary-buttons'
import { InventoryTable } from './_components/inventory-table'
import { InventoryDialogs } from './_components/inventory-dialogs'

export default function InventoryPage() {
  return (
    <InventoryProvider>
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Quản lý kho</h2>
            <p className="text-muted-foreground">
              Quản lý tồn kho và giao dịch kho của bạn.
            </p>
          </div>
          <InventoryPrimaryButtons />
        </div>
        <InventoryTable />
      </div>

      <InventoryDialogs />
    </InventoryProvider>
  )
}
