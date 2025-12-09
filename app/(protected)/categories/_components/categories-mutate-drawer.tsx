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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import ImageUpload from "@/components/shared/image-upload";
import { SlugInput } from "@/components/shared/slug-input";
import { CategoryFormValues, categorySchema } from "@/schemas/categories";
import { categoryQueries, categoryService } from "@/services/categoryService";
import { ICategory } from "@/types/products";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface CategoriesMutateDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCategory: ICategory | null;
}

export function CategoriesMutateDrawer({
  open,
  onOpenChange,
  currentCategory,
}: CategoriesMutateDrawerProps) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const isUpdate = !!currentCategory;

  // Fetch all categories for parent selection (exclude current category and its children)
  const { data: categoriesData } = useQuery({
    ...categoryQueries.listAll(),
    enabled: open,
  });

  const categories = categoriesData || [];
  const availableParents = categories.filter((cat) =>
    currentCategory ? cat.id !== currentCategory.id : true,
  );

  const parentOptions = availableParents.map((category: ICategory) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      imageUrl: "",
      isActive: true,
      parentId: undefined,
    },
  });

  // Reset form when dialog opens/closes or category changes
  useEffect(() => {
    if (open) {
      if (currentCategory) {
        form.reset({
          name: currentCategory.name,
          slug: currentCategory.slug || "",
          description: currentCategory.description || "",
          imageUrl: currentCategory.imageUrl || "",
          isActive: currentCategory.isActive ?? true,
          parentId: currentCategory.parentId || undefined,
        });
      } else {
        form.reset({
          name: "",
          slug: "",
          description: "",
          imageUrl: "",
          isActive: true,
          parentId: undefined,
        });
      }
    }
  }, [open, currentCategory, form]);

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

      if (isUpdate && currentCategory) {
        await categoryService.update(currentCategory.id, values);
        toast.success("Đã cập nhật danh mục thành công");
      } else {
        await categoryService.create(values);
        toast.success("Đã thêm danh mục thành công");
      }

      // Invalidate and refetch categories data
      await queryClient.invalidateQueries({
        queryKey: ["categories", "list"],
      });

      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast.error(error?.message || `Không thể ${isUpdate ? "cập nhật" : "thêm"} danh mục`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-2xl">
        <SheetHeader className="text-start">
          <SheetTitle>{isUpdate ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            id="categories-form"
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
                      <FormLabel>Tên danh mục</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập tên danh mục" />
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
                          placeholder="Nhập mô tả danh mục (tùy chọn)"
                          className="min-h-[80px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Category Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thông tin khác</h3>
              <div className="rounded-lg border bg-card p-4 space-y-4">
                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục cha</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value ? Number(value) : undefined)}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục cha (tùy chọn)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {parentOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hình ảnh danh mục</FormLabel>
                      <FormControl>
                        <ImageUpload
                          maxImages={1}
                          folder="category-images"
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
          <Button form="categories-form" type="submit">
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : isUpdate ? (
              "Cập nhật"
            ) : (
              "Thêm danh mục"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
