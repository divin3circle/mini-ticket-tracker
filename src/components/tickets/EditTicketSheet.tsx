import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Save } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateTicket } from '@/hooks/useTickets';
import { useToaster } from '@/hooks/useToaster';
import type { Ticket, TicketStatus, TicketPriority } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const statusItems = [
  { label: 'Open', value: 'OPEN' },
  { label: 'In Progress', value: 'INPROGRESS' },
  { label: 'Closed', value: 'CLOSED' },
];

const priorityItems = [
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
];

function mapStatusToBackend(status: TicketStatus): 'OPEN' | 'INPROGRESS' | 'CLOSED' {
  switch (status) {
    case 'open':
      return 'OPEN';
    case 'in_progress':
      return 'INPROGRESS';
    case 'closed':
      return 'CLOSED';
  }
}

function mapPriorityToBackend(priority: TicketPriority): 'LOW' | 'MEDIUM' | 'HIGH' {
  switch (priority) {
    case 'low':
      return 'LOW';
    case 'medium':
      return 'MEDIUM';
    case 'high':
      return 'HIGH';
  }
}

interface EditTicketSheetProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditTicketSheet({ ticket, isOpen, onClose }: EditTicketSheetProps) {
  const updateTicket = useUpdateTicket();
  const toaster = useToaster();
  const [status, setStatus] = useState<'OPEN' | 'INPROGRESS' | 'CLOSED'>('OPEN');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');

  // Initialize state from ticket prop - using useMemo to avoid effect
  const initialStatus = ticket ? mapStatusToBackend(ticket.status) : 'OPEN';
  const initialPriority = ticket ? mapPriorityToBackend(ticket.priority) : 'LOW';
  const [status, setStatus] = useState<'OPEN' | 'INPROGRESS' | 'CLOSED'>(initialStatus);
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>(initialPriority);

  // Update state when ticket changes
  useEffect(() => {
    if (ticket) {
      setStatus(mapStatusToBackend(ticket.status));
      setPriority(mapPriorityToBackend(ticket.priority));
    }
  }, [ticket]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ticket) return;

    updateTicket.mutate(
      {
        id: ticket.id,
        data: { status, priority },
      },
      {
        onSuccess: () => {
          toaster.create({
            title: 'Success',
            description: 'Ticket updated successfully',
            type: 'success',
          });
          onClose();
        },
        onError: (error: Error) => {
          toaster.create({
            title: 'Error',
            description: error.message,
            type: 'error',
          });
        },
      }
    );
  };

  const handleStatusChange = (value: string | null) => {
    if (value) setStatus(value as 'OPEN' | 'INPROGRESS' | 'CLOSED');
  };

  const handlePriorityChange = (value: string | null) => {
    if (value) setPriority(value as 'LOW' | 'MEDIUM' | 'HIGH');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <form onSubmit={handleSubmit} className="ml-3">
          <SheetHeader>
            <SheetTitle>Edit Ticket</SheetTitle>
            <SheetDescription>Update ticket status and priority</SheetDescription>
          </SheetHeader>

          <div className="space-y-4 mt-4">
            <Field>
              <FieldLabel>Title</FieldLabel>
              <div className="text-sm text-muted-foreground">{ticket?.title}</div>
            </Field>

            <Field>
              <FieldLabel htmlFor="edit-status">Status</FieldLabel>
              <Select items={statusItems} id="edit-status" value={status} onValueChange={handleStatusChange} disabled={updateTicket.isPending}>
                <SelectTrigger className="w-full" size="sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {statusItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldDescription>Current state of the ticket.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="edit-priority">Priority</FieldLabel>
              <Select items={priorityItems} id="edit-priority" value={priority} onValueChange={handlePriorityChange} disabled={updateTicket.isPending}>
                <SelectTrigger className="w-full" size="sm">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {priorityItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldDescription>How urgent is this ticket?</FieldDescription>
            </Field>
          </div>

          <SheetFooter className="flex justify-end gap-2 mt-6">
            <SheetClose>
              <Button type="button" variant="ghost" disabled={updateTicket.isPending}>
                Cancel
              </Button>
            </SheetClose>
            <Button type="submit" disabled={updateTicket.isPending}>
              {updateTicket.isPending ? <LoadingSpinner size="sm" /> : <HugeiconsIcon icon={Save} />}
              {updateTicket.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}