"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

import ImageUpload from "@/components/shared/image-upload";
import { BannerFormValues, bannerSchema } from "@/schemas/banners";
import { bannerService } from "@/services/bannerService";
import { IBanner } from "@/types/banner";
import { Loader2 } from "lucide-react";

interface BannersMutateDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBanner: IBanner | null;
}

export function BannersMutateDrawer({
  open,
  onOpenChange,
  currentBanner,
}: BannersMutateDrawerProps) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const isUpdate = !!currentBanner;

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: "",
      imageUrl: "",
      linkUrl: "",
      isActive: true,
    },
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Reset form when dialog opens/closes or banner changes
  useEffect(() => {
    if (open) {
      if (currentBanner) {
        form.reset({
          title: currentBanner.title || "",
          imageUrl: currentBanner.imageUrl,
          linkUrl: currentBanner.linkUrl || "",
          isActive: currentBanner.isActive ?? true,
        });
        setImageUrls(currentBanner.imageUrl ? [currentBanner.imageUrl] : []);
      } else {
        form.reset({
          title: "",
          imageUrl: "",
          linkUrl: "",
          isActive: true,
        });
        setImageUrls([]);
      }
    }
  }, [open, currentBanner, form]);

  const handleSubmit = async (values: BannerFormValues) => {
    setLoading(true);
    try {
      // Validate that image is uploaded
      if (imageUrls.length === 0) {
        toast.error("Vui lòng tải lên hình ảnh banner");
        return;
      }

      const submitData = {
        ...values,
        imageUrl: imageUrls[0],
      };

      if (isUpdate && currentBanner) {
        await bannerService.update(currentBanner.id, submitData);
        toast.success("Đã cập nhật banner thành công");
      } else {
        await bannerService.create(submitData);
        toast.success("Đã thêm banner thành công");
      }

      // Invalidate and refetch banners data
      await queryClient.invalidateQueries({
        queryKey: ["banners"],
      });

      onOpenChange(false);
      form.reset();
      setImageUrls([]);
    } catch (error: any) {
      toast.error(error?.message || `Không thể ${isUpdate ? "cập nhật" : "thêm"} banner`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-2xl">
        <SheetHeader className="text-start">
          <SheetTitle>{isUpdate ? "Chỉnh sửa banner" : "Thêm banner mới"}</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            id="banners-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex-1 space-y-6 overflow-y-auto px-4 pb-6"
          >
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thông tin cơ bản</h3>
              <div className="rounded-lg border bg-card p-4 space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề banner</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập tiêu đề banner" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="linkUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL liên kết</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập URL liên kết" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Hình ảnh</h3>
              <div className="rounded-lg border bg-card p-4">
                <ImageUpload
                  maxImages={1}
                  folder="banners"
                  value={imageUrls}
                  onChange={setImageUrls}
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Trạng thái</h3>
              <div className="rounded-lg border bg-card p-4">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>Hoạt động</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>

        <SheetFooter className="gap-2">
          <Button form="banners-form" type="submit">
            {loading ? <Loader2 className="animate-spin" /> : isUpdate ? "Cập nhật" : "Thêm banner"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
