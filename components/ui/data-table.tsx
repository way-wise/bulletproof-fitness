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
import { ChevronLeft, ChevronRight } from "lucide-react";

// Table Props Interface
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: PaginatedData<TData>;
}

export const DataTable = <TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) => {
  // Pagination state
  const [paginationState, setPaginationState] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(10),
    },
    {
      shallow: false,
    }
  );
  
  // Row selection state
  const [rowSelection, setRowSelection] = React.useState({});

  // Pagination state for tanstack table
  const pagination: PaginationState = {
    pageIndex: paginationState.page - 1,
    pageSize: paginationState.limit,
  };
  
  // Handle pagination changes
  const handlePaginationChange = (updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState)) => {
    // Handle both function updater and direct value
    const newPagination = typeof updaterOrValue === 'function' 
      ? updaterOrValue(pagination) 
      : updaterOrValue;
    
    // Update both page and limit
    setPaginationState({
      page: newPagination.pageIndex + 1,
      limit: newPagination.pageSize,
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
      <div className="overflow-auto">
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
        <div className="flex items-center justify-between pt-6">
          <div className="text-sm text-muted-foreground">
            Showing {(paginationState.page - 1) * paginationState.limit + 1}
            &nbsp;&minus;&nbsp;
            {Math.min(
              paginationState.page * paginationState.limit,
              data.meta.total
            )} 
            &nbsp;of&nbsp;
            {data.meta.total}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
