"use client";

import { StaffsDialogs } from "./_components/staffs-dialogs";
import { StaffsPrimaryButtons } from "./_components/staffs-primary-buttons";
import { StaffsProvider } from "./_components/staffs-provider";
import { StaffsTable } from "./_components/staffs-table";

export default function StaffsPage() {
  return (
    <StaffsProvider>
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Nhân viên</h2>
            <p className="text-muted-foreground">Quản lý danh sách nhân viên của bạn.</p>
          </div>
          <StaffsPrimaryButtons />
        </div>
        <StaffsTable />
      </div>

      <StaffsDialogs />
    </StaffsProvider>
  );
}
