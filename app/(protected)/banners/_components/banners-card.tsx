import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { bannerService } from "@/services/bannerService";
import { IBanner } from "@/types/banner";
import { formatNumberId } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { useBanners } from "./banners-provider";
import { useFeaturePermissions } from "@/hooks/use-feature-permissions";
import { Feature } from "@/config/permissions-config";

interface BannersCardProps {
  banner: IBanner;
}

export function BannersCard({ banner }: BannersCardProps) {
  const { setOpen, setCurrentRow } = useBanners();
  const queryClient = useQueryClient();
  const { canUpdate, canDelete } = useFeaturePermissions(Feature.BANNERS);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await bannerService.delete(banner.id);
      toast.success("Đã xóa banner thành công");

      // Invalidate and refetch banners data
      await queryClient.invalidateQueries({
        queryKey: ["banners"],
      });
    } catch (error: any) {
      toast.error(error?.message || "Không thể xóa banner");
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden py-2 gap-0">
        <div className="relative aspect-video">
          <Image
            src={banner.imageUrl}
            alt={banner.title || "Banner"}
            fill
            className="object-contain"
          />
          <div className="absolute top-0 right-2">
            <span className="text-xs font-medium text-white bg-black/70 px-2 py-1 rounded">
              {formatNumberId(banner.id)}
            </span>
          </div>
          <div className="absolute top-0 left-2">
            <Badge variant={banner.isActive ? "default" : "secondary"}>
              {banner.isActive ? "Hoạt động" : "Không hoạt động"}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="space-y-3">
            {banner.title && <h3 className="font-semibold text-lg line-clamp-1">{banner.title}</h3>}
            {banner.linkUrl && (
              <p className="text-sm text-muted-foreground truncate">Liên kết: {banner.linkUrl}</p>
            )}
            {(canUpdate || canDelete) && (
              <div className="flex gap-2 pt-2">
                {canUpdate && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentRow(banner);
                      setOpen("update");
                    }}
                    className="flex-1"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Sửa
                  </Button>
                )}
                {canDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmOpen(true)}
                    className="flex-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Xóa
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Xóa banner"
        desc={`Bạn có chắc muốn xóa banner "${
          banner.title || `ID: ${banner.id}`
        }"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        destructive
        handleConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
