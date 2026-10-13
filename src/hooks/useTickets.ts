import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  Ticket,
  TicketStatus,
  ListTicketsParams,
  UpdateTicketRequest,
} from '@/lib/api';
import {
  fetchTickets,
  fetchTicketStats,
  createTicket,
  updateTicket,
} from '@/lib/api';

export const ticketKeys = {
  all: ['tickets'] as const,
  lists: () => [...ticketKeys.all, 'list'] as const,
  list: (params: ListTicketsParams) => [...ticketKeys.lists(), params] as const,
  stats: () => [...ticketKeys.all, 'stats'] as const,
  detail: (id: number) => [...ticketKeys.all, 'detail', id] as const,
};

export function useTickets(params: ListTicketsParams) {
  return useQuery({
    queryKey: ticketKeys.list(params),
    queryFn: () => fetchTickets(params),
    select: (data) => data.tickets,
    placeholderData: (previous) => previous,
  });
}

export function useTicketStats() {
  return useQuery({
    queryKey: ticketKeys.stats(),
    queryFn: fetchTicketStats,
    select: (data) => data.stats,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTicket,
    onMutate: async (newTicket) => {
      await queryClient.cancelQueries({ queryKey: ticketKeys.lists() });

      const previousTickets = queryClient.getQueriesData({ queryKey: ticketKeys.lists() });

      queryClient.setQueriesData(
        { queryKey: ticketKeys.lists() },
        (old: { tickets: Ticket[] } | undefined) => {
          if (!old) return old;
          const optimisticTicket: Ticket = {
            id: Date.now(),
            title: newTicket.title,
            description: newTicket.description,
            status: newTicket.status.toLowerCase() as TicketStatus,
            priority: newTicket.priority.toLowerCase() as 'low' | 'medium' | 'high',
            createdat: new Date().toISOString(),
          };
          return { tickets: [optimisticTicket, ...old.tickets] };
        }
      );

      return { previousTickets };
    },
    onError: (_err, _newTicket, context) => {
      if (context?.previousTickets) {
        context.previousTickets.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.stats() });
    },
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTicketRequest }) =>
      updateTicket(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ticketKeys.lists() });
      await queryClient.cancelQueries({ queryKey: ticketKeys.detail(id) });

      const previousLists = queryClient.getQueriesData({ queryKey: ticketKeys.lists() });
      const previousDetail = queryClient.getQueryData(ticketKeys.detail(id));

      queryClient.setQueriesData(
        { queryKey: ticketKeys.lists() },
        (old: { tickets: Ticket[] } | undefined) => {
          if (!old) return old;
          return {
            tickets: old.tickets.map((ticket) =>
              ticket.id === id
                ? {
                    ...ticket,
                    status: (data.status?.toLowerCase() as TicketStatus) ?? ticket.status,
                    priority:
                      (data.priority?.toLowerCase() as 'low' | 'medium' | 'high') ??
                      ticket.priority,
                  }
                : ticket
            ),
          };
        }
      );

      if (previousDetail) {
        queryClient.setQueryData(ticketKeys.detail(id), (old: Ticket | undefined) =>
          old
            ? {
                ...old,
                status: (data.status?.toLowerCase() as TicketStatus) ?? old.status,
                priority:
                  (data.priority?.toLowerCase() as 'low' | 'medium' | 'high') ?? old.priority,
              }
            : old
        );
      }

      return { previousLists, previousDetail };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(ticketKeys.detail(context.previousDetail as number), context.previousDetail);
      }
    },
    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({queryKey: ticketKeys.lists()});
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.stats() });
    },
  });
}