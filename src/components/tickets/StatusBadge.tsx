import { Badge } from '@/components/ui/badge';
import { formatStatus, getStatusColor, type TicketStatus } from '@/lib/ticketUtils';

interface StatusBadgeProps {
  status: TicketStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge className={getStatusColor(status)}>
      {formatStatus(status)}
    </Badge>
  );
}