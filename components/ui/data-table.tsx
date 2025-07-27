"use client";

import * as React from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  OnChangeFn,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { PaginatedData } from "@/lib/dataTypes";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TableSkeleton } from "./table-skeleton";

// Table Props Interface
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: PaginatedData<TData>;
  isPending: boolean;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  onPaginationChange: OnChangeFn<PaginationState>;
}

export const DataTable = <TData, TValue>({
  columns,
  data,
  isPending = false,
  pagination,
  onPaginationChange,
}: DataTableProps<TData, TValue>) => {
  // Row selection state
  const [rowSelection, setRowSelection] = React.useState({});

  // Table configuration
  const table = useReactTable({
    data: data.data || [],
    columns,
    pageCount: Math.ceil(data.meta.total / pagination.pageSize),
    state: {
      rowSelection,
      pagination: {
        pageIndex: pagination.pageIndex - 1,
        pageSize: pagination.pageSize,
      },
    },
    manualPagination: true,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
  });

  // Handle limit change
  const handleLimitChange = (value: string) => {
    onPaginationChange({ pageIndex: 1, pageSize: Number(value) });
  };

  return (
    <>
      {/* Table */}
      <div className="relative overflow-auto">
        <table className="w-full">
          <thead className="border-b bg-secondary tracking-wide dark:bg-background">
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
            {isPending ? (
              <TableSkeleton
                columns={columns.length}
                rows={pagination.pageSize}
              />
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted/50"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="max-w-[230px] truncate px-6 py-3.5 text-sm"
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
      <div className="flex flex-wrap items-center justify-center gap-4 pt-6 sm:justify-between">
        {/* Pagination range indicator (e.g., '1-10 of 50') */}
        <div className="text-sm text-muted-foreground">
          Showing {(pagination.pageIndex - 1) * pagination.pageSize + 1}
          &nbsp;&minus;&nbsp;
          {Math.min(
            pagination.pageIndex * pagination.pageSize,
            data.meta.total,
          )}
          &nbsp;of&nbsp;
          {data.meta.total}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-4">
          {/* Rows per page selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">
              Rows per page:
            </label>
            <Select
              value={table.getState().pagination.pageSize.toString()}
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

          {/* Previous and Next buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="icon" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="icon" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
