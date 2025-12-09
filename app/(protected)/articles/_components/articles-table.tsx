"use client";

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
import { articleService } from "@/services/articleService";
import { IArticle } from "@/types/article";
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
import { useEffect, useRef, useState } from "react";
import { articlesColumns } from "./articles-columns";

type DataTableProps = {
  data?: IArticle[];
};

export function ArticlesTable({ data }: DataTableProps) {
  // Local UI-only states
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    slug: false,
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state management
  const pageParam = searchParams.get("page");
  const pageIndex = pageParam ? Math.max(0, Number(pageParam) - 1) : 0;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const globalFilter = searchParams.get("filter") || "";
  const publishedFilter = searchParams.get("isPublished");

  // Local state for search input (to prevent input lag)
  const [searchInput, setSearchInput] = useState(globalFilter);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Column filters state (articles have isPublished filter)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    ...(publishedFilter !== null ? [{ id: "isPublished", value: [publishedFilter] }] : []),
  ]);

  // Update URL when column filters change
  const updateColumnFilters = (updaterOrValue: any) => {
    const newFilters =
      typeof updaterOrValue === "function" ? updaterOrValue(columnFilters) : updaterOrValue;

    setColumnFilters(newFilters);
    const newParams = new URLSearchParams(searchParams.toString());

    // Remove existing filter params
    newParams.delete("isPublished");
    newParams.delete("page"); // Reset to first page

    // Add new filter params
    newFilters.forEach((filter: any) => {
      if (filter.id === "isPublished") {
        const value = Array.isArray(filter.value) ? filter.value[0] : filter.value;
        if (value) {
          newParams.set("isPublished", value.toString());
        }
      }
    });

    router.push(`?${newParams.toString()}`);
  };

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

  // Build filters for API call
  const filters = (() => {
    const result: any = {};
    if (globalFilter) result.search = globalFilter;

    // Add column filters
    columnFilters.forEach((filter) => {
      if (filter.id === "isPublished") {
        const value = Array.isArray(filter.value) ? filter.value[0] : filter.value;
        if (value) {
          result.isPublished = value === "true";
        }
      }
    });

    return result;
  })();

  // Fetch articles data
  const {
    data: articlesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["articles", "list", { page: pageIndex, size: pageSize, filters }],
    queryFn: () => articleService.list(pageIndex, pageSize, filters),
    placeholderData: (previousData) => previousData,
  });

  const articles = articlesData?.content || [];
  const pageCount = articlesData?.totalPages || 0;

  const table = useReactTable({
    data: articles,
    columns: articlesColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: updateColumnFilters,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      updateUrl({
        page: (newPagination.pageIndex + 1).toString(),
        pageSize: newPagination.pageSize.toString(),
      });
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    // onGlobalFilterChange is now handled by handleSearchChange with debounce
    onGlobalFilterChange: () => {
      // This is handled by handleSearchChange, but we keep it to avoid warnings
    },
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    pageCount,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      },
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

  if (isLoading && !articles.length) {
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
        searchPlaceholder="Tìm kiếm bài viết..."
        searchValue={searchInput}
        onSearchChange={handleSearchChange}
        filters={[
          {
            columnId: "isPublished",
            title: "Trạng thái xuất bản",
            options: [
              {
                label: "Đã xuất bản",
                value: "true",
              },
              {
                label: "Chưa xuất bản",
                value: "false",
              },
            ],
          },
        ]}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={articlesColumns.length} className="h-24 text-center">
                  {isLoading
                    ? <Loader2 className="animate-spin mr-2" /> + "Đang tải..."
                    : "Không có bài viết nào."}
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
