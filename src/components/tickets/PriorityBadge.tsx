import { Badge } from '@/components/ui/badge';
import { formatPriority, getPriorityColor, type TicketPriority } from '@/lib/ticketUtils';

interface PriorityBadgeProps {
  priority: TicketPriority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <Badge className={getPriorityColor(priority)}>
      {formatPriority(priority)}
    </Badge>
  );
}