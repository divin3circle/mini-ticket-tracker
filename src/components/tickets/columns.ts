import { columnHelper } from '@/components/tickets/columns';
import type { Ticket } from '@/lib/api';
import { StatusBadge } from '@/components/tickets/StatusBadge';
import { PriorityBadge } from '@/components/tickets/PriorityBadge';
import { formatDate } from '@/lib/ticketUtils';
import { filterFn_equals } from '@tanstack/table-core';

export function createTicketColumns() {
  return [
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
      cell: (info) => <StatusBadge status={info.getValue() as import('@/lib/api').TicketStatus} />,
      filterFn: filterFn_equals,
    }),
    columnHelper.accessor('priority', {
      header: 'Priority',
      cell: (info) => <PriorityBadge priority={info.getValue() as import('@/lib/api').TicketPriority} />,
      filterFn: filterFn_equals,
    }),
    columnHelper.accessor('createdat', {
      header: 'Created',
      cell: (info) => formatDate(info.getValue() as string),
      size: 130,
    }),
  ];
}