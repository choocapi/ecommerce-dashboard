"use client";

import { RotateCcw } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SlugInputProps {
  name: string;
  sourceFieldName: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function SlugInput({
  name,
  sourceFieldName,
  label = "Slug",
  placeholder = "Nhập slug",
  className,
}: SlugInputProps) {
  const { control, getValues, setValue, watch } = useFormContext();

  const generateSlug = () => {
    const sourceValue = getValues(sourceFieldName);
    if (sourceValue) {
      const slug = sourceValue
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
      setValue(name, slug);
    }
  };

  return (
    <FormItem className={className}>
      <FormLabel>{label}</FormLabel>
      <div className="flex gap-2">
        <FormControl>
          <Input {...control.register(name)} placeholder={placeholder} />
        </FormControl>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={generateSlug}
          className="shrink-0"
        >
          <RotateCcw className="size-4" />
          Tạo slug
        </Button>
      </div>
      <FormMessage />
    </FormItem>
  );
}

