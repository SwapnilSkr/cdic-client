"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  type SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { mockReportData, type ReportItem } from "@/utils/mockReportData";

const columns: ColumnDef<ReportItem>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "topic",
    header: "Topic",
  },
  {
    accessorKey: "platform",
    header: "Platform",
  },
  {
    accessorKey: "sentiment",
    header: "Sentiment",
  },
  {
    accessorKey: "engagement",
    header: "Engagement",
  },
  {
    accessorKey: "reach",
    header: "Reach",
  },
  {
    accessorKey: "interactions",
    header: "Interactions",
  },
];

interface DetailedReportsProps {
  filters: {
    dateRange?: { from: Date; to: Date };
    topics?: string[];
    platforms?: string[];
    sentiments?: string[];
  };
}

export function DetailedReports({ filters }: DetailedReportsProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredData, setFilteredData] =
    useState<ReportItem[]>(mockReportData);

  useEffect(() => {
    const filtered = mockReportData.filter((item) => {
      const dateInRange = filters.dateRange
        ? new Date(item.date) >= filters.dateRange.from &&
          new Date(item.date) <= filters.dateRange.to
        : true;
      const topicMatch =
        !filters.topics ||
        filters.topics.length === 0 ||
        filters.topics.includes("all") ||
        filters.topics.includes(item.topic);
      const platformMatch =
        !filters.platforms ||
        filters.platforms.length === 0 ||
        filters.platforms.includes("all") ||
        filters.platforms.includes(item.platform);
      const sentimentMatch =
        !filters.sentiments ||
        filters.sentiments.length === 0 ||
        filters.sentiments.includes(item.sentiment);

      return dateInRange && topicMatch && platformMatch && sentimentMatch;
    });

    setFilteredData(filtered);
    setCurrentPage(0); // Reset to first page when filters change
  }, [filters]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div>
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
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <div className="flex items-center space-x-2">
          {Array.from({ length: table.getPageCount() }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i ? "default" : "outline"}
              size="sm"
              onClick={() => {
                table.setPageIndex(i);
                setCurrentPage(i);
              }}
            >
              {i + 1}
            </Button>
          )).slice(0, 10)}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
