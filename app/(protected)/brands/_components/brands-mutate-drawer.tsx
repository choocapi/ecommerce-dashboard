"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { SlugInput } from "@/components/shared/slug-input";
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
import { Textarea } from "@/components/ui/textarea";

import ImageUpload from "@/components/shared/image-upload";
import { BrandFormValues, brandSchema } from "@/schemas/brands";
import { brandService } from "@/services/brandService";
import { IBrand } from "@/types/products";
import { Loader2 } from "lucide-react";

interface BrandsMutateDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBrand: IBrand | null;
}

export function BrandsMutateDrawer({ open, onOpenChange, currentBrand }: BrandsMutateDrawerProps) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const isUpdate = !!currentBrand;

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      logoUrl: "",
      isActive: true,
    },
  });

  // Reset form when dialog opens/closes or brand changes
  useEffect(() => {
    if (open) {
      if (currentBrand) {
        form.reset({
          name: currentBrand.name,
          slug: currentBrand.slug || "",
          description: currentBrand.description || "",
          logoUrl: currentBrand.logoUrl || "",
          isActive: currentBrand.isActive ?? true,
        });
      } else {
        form.reset({
          name: "",
          slug: "",
          description: "",
          logoUrl: "",
          isActive: true,
        });
      }
    }
  }, [open, currentBrand, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Auto-generate slug from name if not provided
      if (!values.slug && values.name) {
        values.slug = values.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      }

      if (isUpdate && currentBrand) {
        await brandService.update(currentBrand.id, values);
        toast.success("Đã cập nhật thương hiệu thành công");
      } else {
        await brandService.create(values);
        toast.success("Đã thêm thương hiệu thành công");
      }

      // Invalidate and refetch brands data
      await queryClient.invalidateQueries({
        queryKey: ["brands", "list"],
      });

      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast.error(error?.message || `Không thể ${isUpdate ? "cập nhật" : "thêm"} thương hiệu`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-2xl">
        <SheetHeader className="text-start">
          <SheetTitle>{isUpdate ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            id="brands-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex-1 space-y-6 overflow-y-auto px-4 pb-6"
          >
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thông tin cơ bản</h3>
              <div className="rounded-lg border bg-card p-4 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên thương hiệu</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập tên thương hiệu" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SlugInput name="slug" sourceFieldName="name" />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Nhập mô tả thương hiệu (tùy chọn)"
                          className="min-h-[80px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Brand Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thông tin khác</h3>
              <div className="rounded-lg border bg-card p-4 space-y-4">
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo thương hiệu</FormLabel>
                      <FormControl>
                        <ImageUpload
                          maxImages={1}
                          folder="brand-logos"
                          value={field.value ? [field.value] : []}
                          onChange={(urls) => field.onChange(urls[0] || "")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
          <Button form="brands-form" type="submit">
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : isUpdate ? (
              "Cập nhật"
            ) : (
              "Thêm thương hiệu"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
