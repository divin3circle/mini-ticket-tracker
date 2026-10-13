import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TICKET_STATUS_OPTIONS, PAGE_SIZE_OPTIONS, type TicketStatus } from '@/lib/ticketUtils';

interface TicketTableHeaderProps {
  statusFilter: TicketStatus;
  onStatusFilterChange: (status: TicketStatus) => void;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
}

export function TicketTableHeader({
  statusFilter,
  onStatusFilterChange,
  pageSize,
  onPageSizeChange,
}: TicketTableHeaderProps) {
  const handleStatusChange = (value: string | null) => {
    if (value) onStatusFilterChange(value as TicketStatus);
  };

  const handlePageSizeChange = (value: number | null) => {
    if (value !== null) onPageSizeChange(value);
  };

  return (
    <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Status:</span>
        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-40" size="sm">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {TICKET_STATUS_OPTIONS.map((option) => (
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
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}