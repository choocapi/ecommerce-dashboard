"use client";

import { BrandsProvider } from './_components/brands-provider'
import { BrandsPrimaryButtons } from './_components/brands-primary-buttons'
import { BrandsTable } from './_components/brands-table'
import { BrandsDialogs } from './_components/brands-dialogs'

export default function BrandsPage() {
  return (
    <BrandsProvider>
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Thương hiệu</h2>
            <p className="text-muted-foreground">
              Quản lý danh sách thương hiệu của bạn.
            </p>
          </div>
          <BrandsPrimaryButtons />
        </div>
        <BrandsTable />
      </div>

      <BrandsDialogs />
    </BrandsProvider>
  )
}
