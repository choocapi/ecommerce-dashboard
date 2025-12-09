import ImageUpload from "@/components/shared/image-upload";
import { NumberInput } from "@/components/shared/number-input";
import { SelectDropdown } from "@/components/shared/select-dropdown";
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
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { productSchema, type ProductFormValues } from "@/schemas";
import { brandService } from "@/services/brandService";
import { categoryService } from "@/services/categoryService";
import { productService } from "@/services/productService";
import { IBrand, ICategory, IProduct, parseImageUrls } from "@/types/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SpecificationsField } from "./specifications-field";

type ProductsMutateDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentProduct: IProduct | null;
};

export function ProductsMutateDrawer({
  open,
  onOpenChange,
  currentProduct,
}: ProductsMutateDrawerProps) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [descriptionContent, setDescriptionContent] = useState("");

  // Fetch categories and brands
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: () => categoryService.listAll(),
    enabled: open, // Only fetch when drawer is open
  });

  const { data: brandsData, isLoading: brandsLoading } = useQuery({
    queryKey: ["brands", "all"],
    queryFn: () => brandService.listAll(),
    enabled: open, // Only fetch when drawer is open
  });

  const isUpdate = !!currentProduct;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      sku: "",
      name: "",
      slug: "",
      description: "",
      price: 0,
      originalPrice: undefined,
      discountPercentage: 0,
      importPrice: undefined,
      categoryId: undefined,
      brandId: undefined,
      specifications: "{}",
      quantity: 0,
      isPublished: false,
      isFeatured: false,
      imageUrls: [],
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (currentProduct && open) {
      // Calculate discount percentage from original price and current price
      let discountPercentage = 0;
      if (
        currentProduct.originalPrice &&
        currentProduct.originalPrice > 0 &&
        currentProduct.price
      ) {
        discountPercentage = Math.round(
          ((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) *
            100,
        );
      }

      form.reset({
        sku: currentProduct.sku || "",
        name: currentProduct.name || "",
        slug: currentProduct.slug || "",
        description: currentProduct.description || "<p></p>",
        price: currentProduct.price || 0,
        originalPrice: currentProduct.originalPrice || undefined,
        discountPercentage: discountPercentage,
        importPrice: currentProduct.importPrice || undefined,
        categoryId: currentProduct.categoryId || undefined,
        brandId: currentProduct.brandId || undefined,
        specifications: currentProduct.specifications || "{}",
        quantity: currentProduct.quantity || 0,
        isPublished: currentProduct.isPublished ?? false,
        isFeatured: currentProduct.isFeatured ?? false,
        imageUrls: parseImageUrls(currentProduct.imageUrls),
      });
      setDescriptionContent(currentProduct.description || "");
    } else if (!currentProduct && open) {
      form.reset({
        sku: "",
        name: "",
        slug: "",
        description: "",
        price: 0,
        originalPrice: undefined,
        discountPercentage: 0,
        importPrice: undefined,
        categoryId: undefined,
        brandId: undefined,
        specifications: "{}",
        quantity: 0,
        isPublished: false,
        isFeatured: false,
        imageUrls: [],
      });
    }
  }, [currentProduct, open, form]);

  // Auto-calculate price when originalPrice or discountPercentage changes
  useEffect(() => {
    const originalPrice = form.watch("originalPrice");
    const discountPercentage = form.watch("discountPercentage");

    if (
      originalPrice &&
      originalPrice > 0 &&
      discountPercentage !== undefined &&
      discountPercentage >= 0
    ) {
      const calculatedPrice = originalPrice * (1 - discountPercentage / 100);
      form.setValue("price", Math.round(calculatedPrice));
    } else if (originalPrice && originalPrice > 0) {
      // If no discount, price equals original price
      form.setValue("price", originalPrice);
    } else {
      // If no original price, reset price to 0
      form.setValue("price", 0);
    }
  }, [form.watch("originalPrice"), form.watch("discountPercentage"), form]);

  const handleSubmit = async (values: ProductFormValues) => {
    setLoading(true);
    try {
      // Convert imageUrls array to JSON string for backend
      const payload = {
        ...values,
        imageUrls: JSON.stringify(values.imageUrls || []),
      };

      if (isUpdate && currentProduct) {
        await productService.update(currentProduct.id, payload);
        toast.success("Sản phẩm đã được cập nhật thành công");
      } else {
        await productService.create(payload);
        toast.success("Sản phẩm đã được tạo thành công");
      }

      // Invalidate and refetch products data
      await queryClient.invalidateQueries({
        queryKey: ["products", "list"],
      });

      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast.error(error?.message || `Không thể ${isUpdate ? "cập nhật" : "tạo"} sản phẩm`);
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = (categoriesData || []).map((category: ICategory) => ({
    label: category.name,
    value: category.id.toString(),
  }));

  const brandOptions = (brandsData || []).map((brand: IBrand) => ({
    label: brand.name,
    value: brand.id.toString(),
  }));

  const isLoadingData = categoriesLoading || brandsLoading;

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
          <SheetTitle>{isUpdate ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            id="products-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex-1 space-y-6 overflow-y-auto px-4 pb-6"
          >
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thông tin cơ bản</h3>
              <div className="rounded-lg border bg-card p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nhập mã SKU" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <SlugInput name="slug" sourceFieldName="name" />
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Tên sản phẩm</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập tên sản phẩm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Mô tả sản phẩm</FormLabel>
                      <FormControl>
                        <MinimalTiptapEditor
                          value={descriptionContent || "<p></p>"}
                          onChange={(value) => {
                            const content =
                              (value as string) === "<p></p>" ? "" : (value as string);
                            setDescriptionContent(content);
                            field.onChange(content);
                          }}
                          placeholder="Nhập mô tả sản phẩm..."
                          output="html"
                          editorContentClassName="p-3"
                          className="min-h-[120px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imageUrls"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormControl>
                        <ImageUpload
                          maxImages={5}
                          folder="products"
                          label="Hình ảnh sản phẩm"
                          value={field.value || []}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Categories & Brands */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Phân loại</h3>
              <div className="rounded-lg border bg-card p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Danh mục</FormLabel>
                        <SelectDropdown
                          defaultValue={field.value?.toString()}
                          onValueChange={(value) =>
                            field.onChange(value ? Number(value) : undefined)
                          }
                          items={categoryOptions}
                          placeholder="Chọn danh mục"
                          disabled={isLoadingData}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="brandId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thương hiệu</FormLabel>
                        <SelectDropdown
                          defaultValue={field.value?.toString()}
                          onValueChange={(value) =>
                            field.onChange(value ? Number(value) : undefined)
                          }
                          items={brandOptions}
                          placeholder="Chọn thương hiệu"
                          disabled={isLoadingData}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Giá cả</h3>
              <div className="rounded-lg border bg-card p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="originalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá gốc</FormLabel>
                        <FormControl>
                          <NumberInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="0"
                            suffix="VND"
                            min={0}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discountPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>% Giảm giá</FormLabel>
                        <FormControl>
                          <NumberInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="0"
                            suffix="%"
                            min={0}
                            max={100}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá bán</FormLabel>
                        <FormControl>
                          <NumberInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="0"
                            suffix="VND"
                            disabled
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="importPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá nhập</FormLabel>
                        <FormControl>
                          <NumberInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="0"
                            suffix="VND"
                            min={0}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số lượng</FormLabel>
                        <FormControl>
                          <NumberInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="0"
                            min={0}
                            disabled
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thông số kỹ thuật</h3>
              <div className="rounded-lg border bg-card p-4">
                <FormField
                  control={form.control}
                  name="specifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SpecificationsField value={field.value || ""} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Trạng thái</h3>
              <div className="rounded-lg border bg-card p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>Sản phẩm nổi bật</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </form>
        </Form>

        <SheetFooter className="gap-2">
          <Button form="products-form" type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : isUpdate ? (
              "Cập nhật"
            ) : (
              "Thêm sản phẩm"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
