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
import { orderService } from "@/services/orderService";
import { OrderStatusEnum, PaymentMethodEnum } from "@/types/enums";
import { IOrder, getOrderStatusLabel, getPaymentMethodLabel } from "@/types/order";
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
import { ordersColumns } from "./orders-columns";

type DataTableProps = {
  data?: IOrder[];
};

export function OrdersTable({ data }: DataTableProps) {
  // UI-only states
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const router = useRouter();
  const searchParams = useSearchParams();

  // URL states
  const pageParam = searchParams.get("page");
  const pageIndex = pageParam ? Math.max(0, Number(pageParam) - 1) : 0;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const globalFilter = searchParams.get("filter") || "";
  const statusFilter = searchParams.get("status")?.split(",") || [];
  const paymentMethodFilter = searchParams.get("paymentMethod")?.split(",") || [];

  // Local state for search input
  const [searchInput, setSearchInput] = useState(globalFilter);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Column filters state
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    ...(statusFilter.length > 0 ? [{ id: "status", value: statusFilter }] : []),
    ...(paymentMethodFilter.length > 0
      ? [{ id: "paymentMethod", value: paymentMethodFilter }]
      : []),
  ]);

  // Update URL when pagination/filter changes
  const updateColumnFilters = (updaterOrValue: any) => {
    const newFilters =
      typeof updaterOrValue === "function" ? updaterOrValue(columnFilters) : updaterOrValue;

    setColumnFilters(newFilters);
    const newParams = new URLSearchParams(searchParams.toString());

    // Remove existing filter params
    newParams.delete("status");
    newParams.delete("paymentMethod");
    newParams.delete("page");

    // Add new filter params
    newFilters.forEach((filter: any) => {
      if (filter.id === "status" && Array.isArray(filter.value) && filter.value.length > 0) {
        newParams.set("status", filter.value.join(","));
      }
      if (filter.id === "paymentMethod" && Array.isArray(filter.value) && filter.value.length > 0) {
        newParams.set("paymentMethod", filter.value.join(","));
      }
    });

    router.push(`?${newParams.toString()}`);
  };

  // Build filters for API call
  const filters = useMemo(() => {
    const result: any = {};
    if (globalFilter) result.search = globalFilter;

    // Find status filter from columnFilters
    const statusColumnFilter = columnFilters.find((f) => f.id === "status");
    if (
      statusColumnFilter &&
      Array.isArray(statusColumnFilter.value) &&
      statusColumnFilter.value.length > 0
    ) {
      result.status = statusColumnFilter.value[0];
    }

    // Find paymentMethod filter from columnFilters
    const paymentMethodColumnFilter = columnFilters.find((f) => f.id === "paymentMethod");
    if (
      paymentMethodColumnFilter &&
      Array.isArray(paymentMethodColumnFilter.value) &&
      paymentMethodColumnFilter.value.length > 0
    ) {
      result.paymentMethod = paymentMethodColumnFilter.value[0];
    }

    return result;
  }, [globalFilter, columnFilters]);

  // Fetch data
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["orders", "list", { page: pageIndex, size: pageSize, filters }],
    queryFn: () => orderService.list(pageIndex, pageSize, filters),
    placeholderData: (previousData) => previousData,
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

  const orders = ordersData?.content || [];
  const pageCount = ordersData?.totalPages || 0;

  const table = useReactTable({
    data: orders,
    columns: ordersColumns,
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
      const id = String(row.getValue("id")).toLowerCase();
      const title = String(row.getValue("shippingName") || "").toLowerCase();
      const searchValue = String(filterValue).toLowerCase();

      return id.includes(searchValue) || title.includes(searchValue);
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
    onGlobalFilterChange: () => {},
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
    setSearchInput(value);

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Debounce URL update (wait 500ms after user stops typing)
    debounceTimeoutRef.current = setTimeout(() => {
      updateUrl({
        filter: value || null,
        page: "1",
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

  // Filter options
  const statusOptions = Object.values(OrderStatusEnum).map((status) => ({
    label: getOrderStatusLabel(status),
    value: status,
  }));

  const paymentMethodOptions = Object.values(PaymentMethodEnum).map((method) => ({
    label: getPaymentMethodLabel(method),
    value: method,
  }));

  if (isLoading && !orders.length) {
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
        searchPlaceholder="Tìm kiếm theo ID hoặc tên người nhận..."
        searchValue={searchInput}
        onSearchChange={handleSearchChange}
        filters={[
          {
            columnId: "status",
            title: "Trạng thái",
            options: statusOptions,
          },
          {
            columnId: "paymentMethod",
            title: "Thanh toán",
            options: paymentMethodOptions,
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
                <TableCell colSpan={ordersColumns.length} className="h-24 text-center">
                  {isLoading
                    ? <Loader2 className="animate-spin mr-2" /> + "Đang tải..."
                    : "Không có đơn hàng nào."}
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
