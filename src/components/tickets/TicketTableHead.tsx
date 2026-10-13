import { Button } from '@/components/ui/button';
import { flexRender } from '@tanstack/react-table';
import type { HeaderGroup } from '@tanstack/table-core';
import type { Ticket } from '@/lib/api';

interface TicketTableHeadProps {
  // @ts-ignore - TanStack Table v9 type inference issues
  headerGroups: HeaderGroup<Ticket, any>[];
}

export function TicketTableHead({ headerGroups }: TicketTableHeadProps) {
  return (
    <thead className="[&_tr]:border-b">
      {headerGroups.map((headerGroup) => (
        <tr key={headerGroup.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className="h-10 px-3 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
              // @ts-ignore - TanStack Table v9 type inference issues
              style={{ width: header.getSize() }}
            >
              {header.isPlaceholder ? null : (
                <div className="flex items-center gap-2">
                  {/* @ts-ignore - TanStack Table v9 type inference issues */}
                  {header.column.getCanSort() ? (
                    <Button
                      variant="ghost"
                      size="xs"
                      className="h-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        {/* @ts-ignore - TanStack Table v9 type inference issues */}
                        header.column.toggleSorting();
                      }}
                    >
                      {/* @ts-ignore - TanStack Table v9 type inference issues */}
                      {header.column.getIsSorted() === 'asc' ? '↑' : header.column.getIsSorted() === 'desc' ? '↓' : '↕'}
                    </Button>
                  ) : null}
                  {/* @ts-ignore - TanStack Table v9 type inference issues */}
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </div>
              )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}