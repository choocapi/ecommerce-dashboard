"use client";

import { CouponsDialogs } from "./_components/coupons-dialogs";
import { CouponsPrimaryButtons } from "./_components/coupons-primary-buttons";
import { CouponsProvider } from "./_components/coupons-provider";
import { CouponsTable } from "./_components/coupons-table";

export default function CouponsPage() {
  return (
    <CouponsProvider>
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Mã giảm giá</h2>
            <p className="text-muted-foreground">Quản lý danh sách mã giảm giá của bạn.</p>
          </div>
          <CouponsPrimaryButtons />
        </div>
        <CouponsTable />
      </div>

      <CouponsDialogs />
    </CouponsProvider>
  );
}

