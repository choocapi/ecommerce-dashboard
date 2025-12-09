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
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

import ImageUpload from "@/components/shared/image-upload";
import { SlugInput } from "@/components/shared/slug-input";
import { ARTICLE_CATEGORIES } from "@/constants/articles";
import { ArticleFormValues, articleSchema } from "@/schemas/articles";
import { articleService } from "@/services/articleService";
import { IArticle } from "@/types/article";
import { Loader2 } from "lucide-react";

interface ArticlesMutateDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentArticle: IArticle | null;
}

export function ArticlesMutateDrawer({
  open,
  onOpenChange,
  currentArticle,
}: ArticlesMutateDrawerProps) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const isUpdate = !!currentArticle;

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "<p></p>",
      featuredImage: "",
      category: "",
      isPublished: false,
    },
  });

  // Reset form when dialog opens/closes or article changes
  useEffect(() => {
    if (open) {
      if (currentArticle) {
        form.reset({
          title: currentArticle.title,
          slug: currentArticle.slug || "",
          content: currentArticle.content || "",
          featuredImage: currentArticle.featuredImage || "",
          category: currentArticle.category || "",
          isPublished: currentArticle.isPublished ?? false,
        });
        setImageUrls(currentArticle.featuredImage ? [currentArticle.featuredImage] : []);
      } else {
        form.reset({
          title: "",
          slug: "",
          content: "<p></p>",
          featuredImage: "",
          category: "",
          isPublished: false,
        });
        setImageUrls([]);
      }
    }
  }, [open, currentArticle, form]);

  const handleSubmit = async (values: ArticleFormValues) => {
    setLoading(true);
    try {
      // Validate that image is uploaded
      if (imageUrls.length === 0) {
        toast.error("Vui lòng tải lên hình ảnh đại diện");
        return;
      }

      const submitData = {
        ...values,
        featuredImage: imageUrls[0],
      };

      if (isUpdate && currentArticle) {
        await articleService.update(currentArticle.id, submitData);
        toast.success("Đã cập nhật bài viết thành công");
      } else {
        await articleService.create(submitData);
        toast.success("Đã thêm bài viết thành công");
      }

      // Invalidate and refetch articles data
      await queryClient.invalidateQueries({
        queryKey: ["articles"],
      });

      onOpenChange(false);
      form.reset();
      setImageUrls([]);
    } catch (error: any) {
      toast.error(error?.message || `Không thể ${isUpdate ? "cập nhật" : "thêm"} bài viết`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) form.reset();
      }}
    >
      <SheetContent className="flex flex-col w-full sm:max-w-2xl">
        <SheetHeader className="text-start">
          <SheetTitle>{isUpdate ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            id="articles-form"
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
                      <FormLabel>Tiêu đề</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập tiêu đề bài viết" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SlugInput name="slug" sourceFieldName="title" />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục bài viết" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ARTICLE_CATEGORIES.map((category) => (
                            <SelectItem key={category.slug} value={category.slug.toLowerCase()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Featured Image */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Hình ảnh đại diện</h3>
              <div className="rounded-lg border bg-card p-4">
                <ImageUpload
                  maxImages={1}
                  folder="articles"
                  value={imageUrls}
                  onChange={setImageUrls}
                />
                {imageUrls.length === 0 && (
                  <p className="text-sm text-red-500 mt-2">Vui lòng tải lên hình ảnh đại diện</p>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Nội dung</h3>
              <div className="rounded-lg border bg-card p-4">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MinimalTiptapEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Nhập nội dung bài viết..."
                          output="html"
                          editorContentClassName="p-3"
                          className="min-h-[120px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Published Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Trạng thái</h3>
              <div className="rounded-lg border bg-card p-4">
                <FormField
                  control={form.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>Xuất bản</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>

        <SheetFooter className="gap-2">
          <Button form="articles-form" type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : isUpdate ? (
              "Cập nhật"
            ) : (
              "Thêm bài viết"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
