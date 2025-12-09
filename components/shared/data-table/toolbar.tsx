import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import { DataTableFacetedFilter } from "./faceted-filter";
import { DataTableViewOptions } from "./view-options";

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
  searchPlaceholder?: string;
  searchKey?: string;
  filters?: {
    columnId: string;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
  // Controlled search props for debouncing
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Lọc...",
  searchKey,
  filters = [],
  searchValue,
  onSearchChange,
}: DataTableToolbarProps<TData>) {
  // Use controlled props if provided, otherwise use table state
  const isControlled = searchValue !== undefined && onSearchChange !== undefined;

  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    (isControlled ? (searchValue?.length ?? 0) > 0 : table.getState().globalFilter);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        {searchKey ? (
          <Input
            placeholder={searchPlaceholder}
            value={
              isControlled
                ? searchValue
                : (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) => {
              if (isControlled) {
                onSearchChange(event.target.value);
              } else {
                table.getColumn(searchKey)?.setFilterValue(event.target.value);
              }
            }}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        ) : (
          <Input
            placeholder={searchPlaceholder}
            value={isControlled ? searchValue : table.getState().globalFilter ?? ""}
            onChange={(event) => {
              if (isControlled) {
                onSearchChange(event.target.value);
              } else {
                table.setGlobalFilter(event.target.value);
              }
            }}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        <div className="flex gap-x-2">
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId);
            if (!column) return null;
            return (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={column}
                title={filter.title}
                options={filter.options}
              />
            );
          })}
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              if (isControlled && onSearchChange) {
                onSearchChange("");
              } else {
              table.setGlobalFilter("");
              }
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ms-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
