"use client";

import { SuppliersProvider } from './_components/suppliers-provider'
import { SuppliersPrimaryButtons } from './_components/suppliers-primary-buttons'
import { SuppliersTable } from './_components/suppliers-table'
import { SuppliersDialogs } from './_components/suppliers-dialogs'

export default function SuppliersPage() {
  return (
    <SuppliersProvider>
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Nhà cung cấp</h2>
            <p className="text-muted-foreground">
              Quản lý danh sách nhà cung cấp của bạn.
            </p>
          </div>
          <SuppliersPrimaryButtons />
        </div>
        <SuppliersTable />
      </div>

      <SuppliersDialogs />
    </SuppliersProvider>
  )
}
