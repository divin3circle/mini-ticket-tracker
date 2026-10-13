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
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
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
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isPending: boolean;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'OPEN' | 'INPROGRESS'>('OPEN');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          <InputGroupAddon align="block-start">
            <InputGroupText>Title</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>Brief summary of the ticket.</FieldDescription>
      </Field>

      <Field>
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

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="ticket-status">Status</FieldLabel>
          <Select items={statusItems} id="ticket-status" value={status} onValueChange={setStatus} disabled={isPending}>
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
          <Select items={priorityItems} id="ticket-priority" value={priority} onValueChange={setPriority} disabled={isPending}>
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
          <HugeiconsIcon icon={Save} className={isPending ? 'animate-spin' : ''} />
          {isPending ? 'Creating...' : 'Create Ticket'}
        </Button>
      </SheetFooter>
    </form>
  );
}

export default function CreateTicketForm() {
  const createTicket = useCreateTicket();
  const toaster = useToaster();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const status = formData.get('status') as 'OPEN' | 'INPROGRESS';
    const priority = formData.get('priority') as 'LOW' | 'MEDIUM' | 'HIGH';

    createTicket.mutate(
      { title, description, status, priority },
      {
        onSuccess: () => {
          toaster.create({
            title: 'Success',
            description: 'Ticket created successfully',
            type: 'success',
          });
          (e.currentTarget as HTMLFormElement).reset();
        },
        onError: (error: Error) => {
          toaster.create({
            title: 'Error',
            description: error.message,
            type: 'destructive',
          });
        },
      }
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <HugeiconsIcon icon={Plus} />
          Create
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Ticket</SheetTitle>
          <SheetDescription>Add a new ticket to the tracker</SheetDescription>
        </SheetHeader>
        <CreateTicketInputGroup onSubmit={handleSubmit} isPending={createTicket.isPending} />
      </SheetContent>
    </Sheet>
  );
}