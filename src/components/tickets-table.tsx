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
} from '@tanstack/table-core';
import { useTable } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { TicketTableHeader } from './tickets/TicketTableHeader';
import { TicketTableHead } from './tickets/TicketTableHead';
import { TicketTableBody } from './tickets/TicketTableBody';
import { TicketTablePagination } from './tickets/TicketTablePagination';
import { TicketTableSkeleton } from './tickets/TicketTableSkeleton';
import type { Ticket, TicketStatus, TicketPriority } from '@/lib/api';
import { StatusBadge } from './tickets/StatusBadge';
import { PriorityBadge } from './tickets/PriorityBadge';
import { formatDate } from '@/lib/ticketUtils';

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

const columnHelper = createColumnHelper();

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
    cell: (info) => <StatusBadge status={info.getValue() as TicketStatus} />,
    filterFn: filterFn_equals,
  }),
  columnHelper.accessor('priority', {
    header: 'Priority',
    cell: (info) => <PriorityBadge priority={info.getValue() as TicketPriority} />,
    filterFn: filterFn_equals,
  }),
  columnHelper.accessor('createdat', {
    header: 'Created',
    cell: (info) => formatDate(info.getValue() as string),
    size: 130,
  }),
];

export interface TicketTableProps {
  data: Ticket[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onStatusFilterChange: (status: TicketStatus) => void;
  onRowClick: (ticket: Ticket) => void;
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
  onRowClick,
  currentPage,
  pageSize,
  statusFilter,
}: TicketTableProps) {
  // @ts-expect-error - TanStack Table v9 type inference issues with Features
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
    return <TicketTableSkeleton />;
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

  const handleRowClick = (row: { original: Ticket }) => {
    onRowClick(row.original);
  };

  const hasNextPage = data.length === pageSize;

  return (
    <div className="space-y-4">
      <TicketTableHeader
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
      />

      <div className="overflow-x-auto">
        <table className="w-full caption-bottom text-sm">
          {/* @ts-expect-error - TanStack Table v9 type inference issues */}
          <TicketTableHead headerGroups={table.getHeaderGroups()} />
          {/* @ts-expect-error - TanStack Table v9 type inference issues */}
          <TicketTableBody
            rows={table.getRowModel().rows}
            onRowClick={handleRowClick}
          />
        </table>
      </div>

      <TicketTablePagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalRows={data.length}
        onPageChange={onPageChange}
        hasNextPage={hasNextPage}
      />
    </div>
  );
}