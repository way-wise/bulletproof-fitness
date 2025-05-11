"use client";

import * as React from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table";
import { PaginatedData } from "@/lib/dataTypes";
import { useQueryStates, parseAsInteger } from "nuqs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Spinner from "@/components/ui/spinner";

// Table Props Interface
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: PaginatedData<TData>;
}

export const DataTable = <TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) => {
  const [pending, startTransition] = React.useTransition();

  // Pagination state
  const [paginationState, setPaginationState] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(10),
    },
    {
      startTransition,
      shallow: false,
    },
  );

  // Row selection state
  const [rowSelection, setRowSelection] = React.useState({});

  // Pagination state for tanstack table
  const pagination: PaginationState = {
    pageIndex: paginationState.page - 1,
    pageSize: paginationState.limit,
  };

  // Handle pagination changes
  const handlePaginationChange = (
    updaterOrValue:
      | PaginationState
      | ((old: PaginationState) => PaginationState),
  ) => {
    // Handle both function updater and direct value
    const newPagination =
      typeof updaterOrValue === "function"
        ? updaterOrValue(pagination)
        : updaterOrValue;

    // Update both page and limit
    setPaginationState({
      page: newPagination.pageIndex + 1,
      limit: newPagination.pageSize,
    });
  };

  // Handle limit changes
  const handleLimitChange = (limit: string) => {
    setPaginationState({
      limit: parseInt(limit),
      page: 1,
    });
  };

  // Table configuration
  const table = useReactTable({
    data: data.data || [],
    columns,
    pageCount: Math.ceil(data.meta.total / paginationState.limit),
    state: {
      rowSelection,
      pagination,
    },
    manualPagination: true,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onPaginationChange: handlePaginationChange,
  });

  return (
    <>
      <div className="relative overflow-auto">
        {/* Loading overlay */}
        {pending && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50">
            <Spinner className="size-12" />
          </div>
        )}
        {/* Main Table */}
        <table className="w-full">
          <thead className="sticky top-0 border-b bg-secondary tracking-wide dark:bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="h-12 px-6 text-left font-medium whitespace-nowrap"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="max-w-[230px] truncate px-6 py-4 text-sm"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-28 text-center text-lg text-muted-foreground"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {table.getPaginationRowModel().rows.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-4 pt-6 sm:justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(paginationState.page - 1) * paginationState.limit + 1}
            &nbsp;&minus;&nbsp;
            {Math.min(
              paginationState.page * paginationState.limit,
              data.meta.total,
            )}
            &nbsp;of&nbsp;
            {data.meta.total}
          </div>
          <div className="flex items-center gap-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="icon" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="icon" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
          <div className="flex items-center gap-x-2">
            <label className="text-sm text-muted-foreground">
              Rows per page:
            </label>
            <Select
              value={paginationState.limit.toString()}
              onValueChange={handleLimitChange}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Select Limit" />
              </SelectTrigger>
              <SelectContent>
                {[10, 30, 50, 100].map((limit) => (
                  <SelectItem key={limit} value={limit.toString()}>
                    {limit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </>
  );
};
