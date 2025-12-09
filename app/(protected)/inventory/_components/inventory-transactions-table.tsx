"use client";

import { DataTablePagination } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { inventoryTransactionService } from "@/services/inventoryTransactionService";
import { InventoryTransactionTypeEnum } from "@/types/enums";
import { IInventoryTransaction } from "@/types/inventory";
import { formatCurrency, formatDateTime } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface InventoryTransactionsTableProps {
  productId: number;
}

const getTypeColor = (type: string) => {
  switch (type) {
    case InventoryTransactionTypeEnum.IN:
      return "default";
    case InventoryTransactionTypeEnum.OUT:
      return "destructive";
    case InventoryTransactionTypeEnum.ADJUST:
      return "secondary";
    default:
      return "outline";
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case InventoryTransactionTypeEnum.IN:
      return "Nhập kho";
    case InventoryTransactionTypeEnum.OUT:
      return "Xuất kho";
    case InventoryTransactionTypeEnum.ADJUST:
      return "Điều chỉnh";
    default:
      return type;
  }
};

const formatQuantityChange = (transaction: IInventoryTransaction): string => {
  if (transaction.type === InventoryTransactionTypeEnum.ADJUST) {
    return `${transaction.previousQuantity || 0} → ${transaction.resultingQuantity || 0}`;
  }

  const quantity = transaction.quantity || 0;
  const sign = transaction.type === InventoryTransactionTypeEnum.IN ? "+" : "-";
  return `${sign}${quantity}`;
};

export const inventoryTransactionsColumns: ColumnDef<IInventoryTransaction>[] = [
  {
    accessorKey: "createdAt",
    header: "Ngày",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return <div className="font-medium">{formatDateTime(date)}</div>;
    },
  },
  {
    accessorKey: "type",
    header: "Loại",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <Badge variant={getTypeColor(type)} className="font-medium">
          {getTypeLabel(type)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Số lượng",
    cell: ({ row }) => {
      const transaction = row.original;
      return <div className="font-medium">{formatQuantityChange(transaction)}</div>;
    },
  },
  {
    accessorKey: "price",
    header: "Giá nhập",
    cell: ({ row }) => {
      const transaction = row.original;
      const price = row.getValue("price") as number;
      if (transaction.type === InventoryTransactionTypeEnum.IN && price) {
        return <div className="text-sm">{formatCurrency(price)}</div>;
      }
      return <div className="text-muted-foreground">—</div>;
    },
  },
  {
    accessorKey: "supplier.name",
    header: "Nhà cung cấp",
    cell: ({ row }) => {
      const supplier = row.original.supplier;
      return <div className="max-w-[150px] truncate">{supplier?.name || "—"}</div>;
    },
  },
  {
    accessorKey: "orderId",
    header: "Mã đơn hàng",
    cell: ({ row }) => {
      const orderId = row.getValue("orderId") as string;
      return <div className="font-mono text-sm">{orderId || "—"}</div>;
    },
  },
  {
    accessorKey: "note",
    header: "Ghi chú",
    cell: ({ row }) => {
      const note = row.getValue("note") as string;
      return (
        <div className="max-w-[200px] truncate" title={note}>
          {note || "—"}
        </div>
      );
    },
  },
];

export function InventoryTransactionsTable({ productId }: InventoryTransactionsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "inventory-transactions",
      "listByProduct",
      { productId, page: pageIndex, size: pageSize },
    ],
    queryFn: () => inventoryTransactionService.listByProduct(productId, pageIndex, pageSize),
    placeholderData: (previousData) => previousData,
  });

  const transactions = data?.content || [];
  const totalRecords = data?.totalElements || 0;

  const table = useReactTable({
    data: transactions,
    columns: inventoryTransactionsColumns,
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.ceil(totalRecords / pageSize),
    state: {
      sorting,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={inventoryTransactionsColumns.length}
                  className="h-24 text-center"
                >
                  {isLoading
                    ? <Loader2 className="animate-spin mr-2" /> + "Đang tải..."
                    : "Không có giao dịch nào."}
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
