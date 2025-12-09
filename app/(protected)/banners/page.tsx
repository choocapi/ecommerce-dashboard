"use client";

import { BannersProvider } from './_components/banners-provider'
import { BannersPrimaryButtons } from './_components/banners-primary-buttons'
import { BannersGrid } from './_components/banners-grid'
import { BannersDialogs } from './_components/banners-dialogs'

export default function BannersPage() {
  return (
    <BannersProvider>
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Banner</h2>
            <p className="text-muted-foreground">
              Quản lý danh sách banner của bạn.
            </p>
          </div>
          <BannersPrimaryButtons />
        </div>
        <BannersGrid />
      </div>

      <BannersDialogs />
    </BannersProvider>
  )
}