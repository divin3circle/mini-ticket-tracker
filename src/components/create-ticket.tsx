import { useState } from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Plus, Save } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field';
import {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateTicket } from '@/hooks/useTickets';
import { useToaster } from '@/hooks/useToaster';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const statusItems = [
  { label: 'Open', value: 'OPEN' },
  { label: 'In Progress', value: 'INPROGRESS' },
];

const priorityItems = [
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
];

function CreateTicketInputGroup({
  onSubmit,
  isPending,
}: {
  onSubmit: (data: { title: string; description: string; status: 'OPEN' | 'INPROGRESS'; priority: 'LOW' | 'MEDIUM' | 'HIGH' }) => void;
  isPending: boolean;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'OPEN' | 'INPROGRESS'>('OPEN');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, description, status, priority });
  };

  const handleStatusChange = (value: string | null) => {
    if (value) setStatus(value as 'OPEN' | 'INPROGRESS');
  };

  const handlePriorityChange = (value: string | null) => {
    if (value) setPriority(value as 'LOW' | 'MEDIUM' | 'HIGH');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 ml-3">
      <Field>
        <FieldLabel htmlFor="ticket-title">Title</FieldLabel>
        <InputGroup className="h-auto">
          <InputGroupInput
            id="ticket-title"
            placeholder="Ticket title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isPending}
          />
        </InputGroup>
        <FieldDescription>Brief summary of the ticket.</FieldDescription>
      </Field>

      <Field className="mt-8">
        <FieldLabel htmlFor="ticket-description">Description</FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            id="ticket-description"
            placeholder="Describe the issue..."
            className="text-sm min-h-[80px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isPending}
          />
        </InputGroup>
        <FieldDescription>Detailed breakdown of the ticket.</FieldDescription>
      </Field>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <Field>
          <FieldLabel htmlFor="ticket-status">Status</FieldLabel>
          <Select items={statusItems} id="ticket-status" value={status} onValueChange={handleStatusChange} disabled={isPending}>
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
          <FieldLabel htmlFor="ticket-priority">Priority</FieldLabel>
          <Select items={priorityItems} id="ticket-priority" value={priority} onValueChange={handlePriorityChange} disabled={isPending}>
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

      <SheetFooter className="flex justify-end gap-2">
        <SheetClose>
          <Button type="button" variant="ghost" disabled={isPending}>
            Cancel
          </Button>
        </SheetClose>
        <Button type="submit" disabled={isPending || !title.trim()}>
          {isPending ? <LoadingSpinner size="sm" /> : <HugeiconsIcon icon={Save} />}
          {isPending ? 'Creating...' : 'Create Ticket'}
        </Button>
      </SheetFooter>
    </form>
  );
}

export default function CreateTicketForm() {
  const createTicket = useCreateTicket();
  const toaster = useToaster();

  const handleSubmit = (data: { title: string; description: string; status: 'OPEN' | 'INPROGRESS'; priority: 'LOW' | 'MEDIUM' | 'HIGH' }) => {
    createTicket.mutate(
      data,
      {
        onSuccess: () => {
          toaster.create({
            title: 'Success',
            description: 'Ticket created successfully',
            type: 'success',
          });
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

  return (
    <Sheet>
      <SheetTrigger>
        <Button>
          <HugeiconsIcon icon={Plus} />
          Create
        </Button>
      </SheetTrigger>
      <SheetContent >
        <SheetHeader>
          <SheetTitle>Create Ticket</SheetTitle>
          <SheetDescription>Add a new ticket to the tracker</SheetDescription>
        </SheetHeader>
        <CreateTicketInputGroup onSubmit={handleSubmit} isPending={createTicket.isPending} />
      </SheetContent>
    </Sheet>
  );
}