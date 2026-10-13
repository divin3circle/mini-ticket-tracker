const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080';

export type TicketStatus = 'open' | 'in_progress' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdat: string;
}

export interface TicketStats {
  open: number;
  in_progress: number;
  closed: number;
}

export interface ListTicketsParams {
  status: TicketStatus;
  page_id: number;
  page_size: number;
}

export interface ListTicketsResponse {
  tickets: Ticket[];
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  status: 'OPEN' | 'INPROGRESS';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface CreateTicketResponse {
  message: string;
  ticket: Ticket;
}

export interface UpdateTicketRequest {
  status?: 'OPEN' | 'INPROGRESS' | 'CLOSED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface UpdateTicketResponse {
  message: string;
  ticket: Ticket;
}

export interface ErrorResponse {
  message: string;
}

function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    return response.json().then((err: ErrorResponse) => {
      throw new Error(err.message ?? `HTTP error ${response.status}`);
    });
  }
  return response.json();
}

function mapStatusToBackend(status: TicketStatus): string {
  switch (status) {
    case 'open':
      return 'OPEN';
    case 'in_progress':
      return 'INPROGRESS';
    case 'closed':
      return 'CLOSED';
  }
}

export async function fetchTickets(params: ListTicketsParams): Promise<ListTicketsResponse> {
  const searchParams = new URLSearchParams({
    status: mapStatusToBackend(params.status),
    page_id: params.page_id.toString(),
    page_size: params.page_size.toString(),
  });
  const response = await fetch(`${API_BASE}/tickets?${searchParams}`);
  return handleResponse<ListTicketsResponse>(response);
}

export async function fetchTicketStats(): Promise<{ stats: TicketStats }> {
  const response = await fetch(`${API_BASE}/tickets/stats`);
  return handleResponse<{ stats: TicketStats }>(response);
}

export async function createTicket(data: CreateTicketRequest): Promise<CreateTicketResponse> {
  const response = await fetch(`${API_BASE}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<CreateTicketResponse>(response);
}

export async function updateTicket(id: number, data: UpdateTicketRequest): Promise<UpdateTicketResponse> {
  const response = await fetch(`${API_BASE}/tickets/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<UpdateTicketResponse>(response);
}