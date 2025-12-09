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

import { SupplierFormValues, supplierSchema } from "@/schemas/suppliers";
import { supplierService } from "@/services/supplierService";
import { ISupplier } from "@/types/supplier";
import { Loader2 } from "lucide-react";

interface SuppliersMutateDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSupplier: ISupplier | null;
}

export function SuppliersMutateDrawer({
  open,
  onOpenChange,
  currentSupplier,
}: SuppliersMutateDrawerProps) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const isUpdate = !!currentSupplier;

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      contactPerson: "",
      email: "",
      phoneNumber: "",
      address: "",
    },
  });

  // Reset form when dialog opens/closes or supplier changes
  useEffect(() => {
    if (open) {
      if (currentSupplier) {
        form.reset({
          name: currentSupplier.name,
          contactPerson: currentSupplier.contactPerson || "",
          email: currentSupplier.email || "",
          phoneNumber: currentSupplier.phoneNumber,
          address: currentSupplier.address,
        });
      } else {
        form.reset({
          name: "",
          contactPerson: "",
          email: "",
          phoneNumber: "",
          address: "",
        });
      }
    }
  }, [open, currentSupplier, form]);

  const handleSubmit = async (values: SupplierFormValues) => {
    setLoading(true);
    try {
      if (isUpdate && currentSupplier) {
        await supplierService.update(currentSupplier.id, values);
        toast.success("Đã cập nhật nhà cung cấp thành công");
      } else {
        await supplierService.create(values);
        toast.success("Đã thêm nhà cung cấp thành công");
      }

      // Invalidate and refetch suppliers data
      await queryClient.invalidateQueries({
        queryKey: ["suppliers", "list"],
      });

      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast.error(error?.message || `Không thể ${isUpdate ? "cập nhật" : "thêm"} nhà cung cấp`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-2xl">
        <SheetHeader className="text-start">
          <SheetTitle>{isUpdate ? "Chỉnh sửa nhà cung cấp" : "Thêm nhà cung cấp mới"}</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            id="suppliers-form"
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
                      <FormLabel>Tên nhà cung cấp</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập tên nhà cung cấp" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập địa chỉ" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thông tin liên hệ</h3>
              <div className="rounded-lg border bg-card p-4">
                <FormField
                  control={form.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Người liên hệ</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập tên người liên hệ" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="Nhập email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nhập số điện thoại" />
                        </FormControl>
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
          <Button form="suppliers-form" type="submit">
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : isUpdate ? (
              "Cập nhật"
            ) : (
              "Thêm nhà cung cấp"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
