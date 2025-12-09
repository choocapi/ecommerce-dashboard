"use client";

import { ProductsProvider } from './_components/products-provider'
import { ProductsPrimaryButtons } from './_components/products-primary-buttons'
import { ProductsTable } from './_components/products-table'
import { ProductsDialogs } from './_components/products-dialogs'

export default function ProductsPage() {
  return (
    <ProductsProvider>
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Sản phẩm</h2>
            <p className="text-muted-foreground">
              Quản lý danh sách sản phẩm của bạn.
            </p>
          </div>
          <ProductsPrimaryButtons />
        </div>
        <ProductsTable />
      </div>

      <ProductsDialogs />
    </ProductsProvider>
  )
}
