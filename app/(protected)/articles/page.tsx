"use client";

import { ArticlesProvider } from './_components/articles-provider'
import { ArticlesPrimaryButtons } from './_components/articles-primary-buttons'
import { ArticlesTable } from './_components/articles-table'
import { ArticlesDialogs } from './_components/articles-dialogs'

export default function ArticlesPage() {
  return (
    <ArticlesProvider>
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Bài viết</h2>
            <p className="text-muted-foreground">
              Quản lý danh sách bài viết của bạn.
            </p>
          </div>
          <ArticlesPrimaryButtons />
        </div>
        <ArticlesTable />
      </div>

      <ArticlesDialogs />
    </ArticlesProvider>
  )
}