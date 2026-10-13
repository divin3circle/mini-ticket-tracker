import { Button } from '@/components/ui/button';

interface TicketTablePaginationProps {
  currentPage: number;
  pageSize: number;
  totalRows: number;
  onPageChange: (pageIndex: number) => void;
  hasNextPage: boolean;
}

export function TicketTablePagination({
  currentPage,
  pageSize,
  totalRows,
  onPageChange,
  hasNextPage,
}: TicketTablePaginationProps) {
  const start = currentPage * pageSize + 1;
  const end = Math.min((currentPage + 1) * pageSize, totalRows);

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-muted-foreground">
        Showing {start} to {end} of {totalRows} results
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
          disabled={!hasNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
}