import { flexRender } from '@tanstack/react-table';
import type { Row } from '@tanstack/table-core';
import type { Ticket } from '@/lib/api';

interface TicketTableBodyProps {
  // @ts-expect-error - TanStack Table v9 type inference issues
  rows: Row<Ticket, any>[];
  // @ts-expect-error - TanStack Table v9 type inference issues
  onRowClick: (row: Row<Ticket, any>) => void;
}

export function TicketTableBody({ rows, onRowClick }: TicketTableBodyProps) {
  return (
    <tbody className="[&_tr:last-child]:border-0">
      {rows.map((row) => (
        <tr
          key={row.id}
          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer"
          onClick={() => onRowClick(row)}
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
  );
}