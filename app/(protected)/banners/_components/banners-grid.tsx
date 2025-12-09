"use client";

import { bannerService } from "@/services/bannerService";
import { IBanner } from "@/types/banner";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { BannersCard } from "./banners-card";

type BannersGridProps = {
  data?: IBanner[];
};

export function BannersGrid({ data }: BannersGridProps) {
  // Fetch all banners data (no pagination)
  const {
    data: bannersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["banners", "all"],
    queryFn: () => bannerService.listAll(),
  });

  const banners = data || bannersData || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-24">
        <Loader2 className="animate-spin mr-2" />
        Đang tải...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-24">
        <div className="text-center text-destructive">
          <p className="text-sm">Không thể tải danh sách banner</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {banners.length === 0 ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium mb-1">Chưa có banner nào</p>
            <p className="text-sm">Nhấn "Thêm banner" để tạo banner đầu tiên</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {banners.map((banner) => (
            <BannersCard key={banner.id} banner={banner} />
          ))}
        </div>
      )}
    </div>
  );
}
