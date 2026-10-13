import {
  tableFeatures,
  createColumnHelper,
  createCoreRowModel,
  createSortedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  columnSizingFeature,
  columnVisibilityFeature,
  rowSelectionFeature,
  rowSortingFeature,
  columnOrderingFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  filterFn_equals,
  type ColumnDef,
} from '@tanstack/table-core';
import { useTable, flexRender } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Ticket, TicketStatus } from '@/lib/api';
import {HugeiconsIcon} from "@hugeicons/react";
import {Loading03FreeIcons} from "@hugeicons/core-free-icons";

const statusColors: Record<TicketStatus, string> = {
  open: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  closed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
};

const priorityColors: Record<'low' | 'medium' | 'high', string> = {
  low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  medium: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const statusOptions: { value: TicketStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' },
];

const features = tableFeatures({
  columnSizingFeature,
  columnVisibilityFeature,
  rowSelectionFeature,
  rowSortingFeature,
  columnOrderingFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  coreRowModel: createCoreRowModel(),
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { equals: filterFn_equals },
});

type Features = typeof features;

const columnHelper = createColumnHelper<Features, Ticket>();

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue(),
    size: 60,
  }),
  columnHelper.accessor('title', {
    header: 'Title',
    cell: (info) => <div className="font-medium">{info.getValue()}</div>,
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: (info) => (
      <div className="text-muted-foreground line-clamp-1 max-w-xs">
        {info.getValue() || '—'}
      </div>
    ),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => {
      const status = info.getValue() as TicketStatus;
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}
        >
          {status.replace('_', ' ')}
        </span>
      );
    },
    filterFn: filterFn_equals,
  }),
  columnHelper.accessor('priority', {
    header: 'Priority',
    cell: (info) => {
      const priority = info.getValue() as 'low' | 'medium' | 'high';
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[priority]}`}
        >
          {priority}
        </span>
      );
    },
    filterFn: filterFn_equals,
  }),
  columnHelper.accessor('createdat', {
    header: 'Created',
    cell: (info) => {
      const date = new Date(info.getValue() as string);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
    size: 130,
  }),
] as unknown as readonly ColumnDef<Features, Ticket, unknown>[];

export interface TicketTableProps {
  data: Ticket[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onStatusFilterChange: (status: TicketStatus) => void;
  currentPage: number;
  pageSize: number;
  statusFilter: TicketStatus;
}

export function TicketTable({
  data,
  isLoading,
  isError,
  error,
  onPageChange,
  onPageSizeChange,
  onStatusFilterChange,
  currentPage,
  pageSize,
  statusFilter,
}: TicketTableProps) {
  const table = useTable({
    key: 'ticket-table',
    features,
    columns,
    data,
    state: {
      sorting: [],
      columnFilters: [
        { id: 'status', value: statusFilter },
      ],
      pagination: {
        pageIndex: currentPage,
        pageSize,
      },
    },
    onSortingChange: () => {},
    onColumnFiltersChange: () => {},
    onPaginationChange: () => {},
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    pageCount: -1,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <HugeiconsIcon icon={Loading03FreeIcons} className="animate-spin" />
        <span className="sr-only">Loading tickets...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-destructive mb-2">Failed to load tickets</div>
        <p className="text-muted-foreground text-sm mb-4">{error?.message}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-muted-foreground mb-2">No tickets found</div>
        <p className="text-sm">Create a ticket to get started</p>
      </div>
    );
  }

  const handleStatusChange = (value: string | null) => {
    if (value) onStatusFilterChange(value as TicketStatus);
  };

  const handlePageSizeChange = (value: number | null) => {
    if (value !== null) onPageSizeChange(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-40" size="sm">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select value={pageSize} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-32" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[10, 25, 50, 100].map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="h-10 px-3 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center gap-2">
                        {header.column.getCanSort() ? (
                          <Button
                            variant="ghost"
                            size="xs"
                            className="h-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              header.column.toggleSorting();
                            }}
                          >
                            {header.column.getIsSorted() === 'asc' ? '↑' : header.column.getIsSorted() === 'desc' ? '↓' : '↕'}
                          </Button>
                        ) : null}
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              >
                {row.getAllCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="p-3 align-middle [&:has([role=checkbox])]:pr-0"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, data.length)} of {data.length} results
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={data.length < pageSize}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}