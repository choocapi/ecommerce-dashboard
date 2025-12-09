import { DataTablePagination, DataTableToolbar } from "@/components/shared/data-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { brandService } from "@/services/brandService";
import { categoryService } from "@/services/categoryService";
import { productService } from "@/services/productService";
import { IBrand, ICategory, IProduct } from "@/types/products";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { productsColumns } from "./products-columns";

type DataTableProps = {
  data?: IProduct[];
};

export function ProductsTable({ data }: DataTableProps) {
  // Local UI-only states
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    categoryId: false,
    brandId: false,
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state management
  const pageParam = searchParams.get("page");
  const pageIndex = pageParam ? Math.max(0, Number(pageParam) - 1) : 0;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const globalFilter = searchParams.get("filter") || "";
  const categoryFilter = searchParams.get("categoryId")?.split(",") || [];
  const brandFilter = searchParams.get("brandId")?.split(",") || [];

  // Local state for search input (to prevent input lag)
  const [searchInput, setSearchInput] = useState(globalFilter);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Column filters state
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    ...(categoryFilter.length > 0 ? [{ id: "categoryId", value: categoryFilter }] : []),
    ...(brandFilter.length > 0 ? [{ id: "brandId", value: brandFilter }] : []),
  ]);

  // Update URL when column filters change
  const updateColumnFilters = (updaterOrValue: any) => {
    const newFilters =
      typeof updaterOrValue === "function" ? updaterOrValue(columnFilters) : updaterOrValue;

    setColumnFilters(newFilters);
    const newParams = new URLSearchParams(searchParams.toString());

    // Remove existing filter params
    newParams.delete("categoryId");
    newParams.delete("brandId");
    newParams.delete("page"); // Reset to first page

    // Add new filter params
    newFilters.forEach((filter: any) => {
      if (filter.id === "categoryId" && Array.isArray(filter.value) && filter.value.length > 0) {
        newParams.set("categoryId", filter.value.join(","));
      }
      if (filter.id === "brandId" && Array.isArray(filter.value) && filter.value.length > 0) {
        newParams.set("brandId", filter.value.join(","));
      }
    });

    router.push(`?${newParams.toString()}`);
  };

  // Build filters for API call
  const filters = useMemo(() => {
    const result: any = {};
    if (globalFilter) result.search = globalFilter;

    // Find category filter from columnFilters
    const categoryColumnFilter = columnFilters.find((f) => f.id === "categoryId");
    if (
      categoryColumnFilter &&
      Array.isArray(categoryColumnFilter.value) &&
      categoryColumnFilter.value.length > 0
    ) {
      result.categoryId = Number(categoryColumnFilter.value[0]);
    }

    // Find brand filter from columnFilters
    const brandColumnFilter = columnFilters.find((f) => f.id === "brandId");
    if (
      brandColumnFilter &&
      Array.isArray(brandColumnFilter.value) &&
      brandColumnFilter.value.length > 0
    ) {
      result.brandId = Number(brandColumnFilter.value[0]);
    }

    return result;
  }, [globalFilter, columnFilters]);

  // Fetch data
  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", "list", { page: pageIndex, size: pageSize, filters }],
    queryFn: () => productService.list(pageIndex, pageSize, filters),
    placeholderData: (previousData) => previousData,
  });

  // Fetch categories and brands for filters
  const { data: categoriesData } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: () => categoryService.listAll(),
  });

  const { data: brandsData } = useQuery({
    queryKey: ["brands", "all"],
    queryFn: () => brandService.listAll(),
  });

  // Update URL when pagination/filter changes
  const updateUrl = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    router.push(`?${newParams.toString()}`);
  };

  const products = productsData?.content || [];
  const pageCount = productsData?.totalPages || 0;

  const table = useReactTable({
    data: products,
    columns: productsColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    enableRowSelection: false,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: (row, _columnId, filterValue) => {
      const sku = String(row.getValue("sku")).toLowerCase();
      const name = String(row.getValue("name")).toLowerCase();
      const searchValue = String(filterValue).toLowerCase();

      return sku.includes(searchValue) || name.includes(searchValue);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    pageCount,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      updateUrl({
        page: (newPagination.pageIndex + 1).toString(),
        pageSize: newPagination.pageSize.toString(),
      });
    },
    onColumnFiltersChange: updateColumnFilters,
    // onGlobalFilterChange is now handled by handleSearchChange with debounce
    onGlobalFilterChange: () => {
      // This is handled by handleSearchChange, but we keep it to avoid warnings
    },
  });

  // Sync searchInput with URL when URL changes externally (e.g., browser back/forward)
  useEffect(() => {
    setSearchInput(globalFilter);
  }, [globalFilter]);

  // Update global filter from URL
  useEffect(() => {
    table.setGlobalFilter(globalFilter);
  }, [globalFilter, table]);

  // Handle search input change with debounce
  const handleSearchChange = (value: string) => {
    setSearchInput(value); // Update input immediately (no lag)

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Debounce URL update (wait 500ms after user stops typing)
    debounceTimeoutRef.current = setTimeout(() => {
      updateUrl({
        filter: value || null,
        page: "1", // Reset to first page when filtering
      });
    }, 500);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Filter options from API data
  const categoryOptions = (categoriesData || []).map((category: ICategory) => ({
    label: category.name,
    value: category.id.toString(),
  }));

  const brandOptions = (brandsData || []).map((brand: IBrand) => ({
    label: brand.name,
    value: brand.id.toString(),
  }));

  if (isLoading && !products.length) {
    return (
      <div className="flex items-center justify-center h-24">
        <Loader2 className="animate-spin mr-2" />
        Đang tải...
      </div>
    );
  }

  return (
    <div className={cn('max-sm:has-[div[role="toolbar"]]:mb-16', "flex flex-1 flex-col gap-4")}>
      <DataTableToolbar
        table={table}
        searchPlaceholder="Tìm kiếm theo SKU hoặc tên sản phẩm..."
        searchValue={searchInput}
        onSearchChange={handleSearchChange}
        filters={[
          {
            columnId: "categoryId",
            title: "Danh mục",
            options: categoryOptions,
          },
          {
            columnId: "brandId",
            title: "Thương hiệu",
            options: brandOptions,
          },
        ]}
      />
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        header.column.columnDef.meta?.className,
                        header.column.columnDef.meta?.thClassName,
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        cell.column.columnDef.meta?.className,
                        cell.column.columnDef.meta?.tdClassName,
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={productsColumns.length} className="h-24 text-center">
                  {isLoading
                    ? <Loader2 className="animate-spin mr-2" /> + "Đang tải..."
                    : "Không có sản phẩm nào."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className="mt-auto" />
    </div>
  );
}
