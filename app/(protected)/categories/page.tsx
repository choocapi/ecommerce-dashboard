"use client";

import { CategoriesProvider } from './_components/categories-provider'
import { CategoriesPrimaryButtons } from './_components/categories-primary-buttons'
import { CategoriesTable } from './_components/categories-table'
import { CategoriesDialogs } from './_components/categories-dialogs'

export default function CategoriesPage() {
  return (
    <CategoriesProvider>
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Danh mục</h2>
            <p className="text-muted-foreground">
              Quản lý danh sách danh mục của bạn.
            </p>
          </div>
          <CategoriesPrimaryButtons />
        </div>
        <CategoriesTable />
      </div>

      <CategoriesDialogs />
    </CategoriesProvider>
  )
}
