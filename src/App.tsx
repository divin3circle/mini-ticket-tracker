import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Sun01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import CreateTicketForm from '@/components/create-ticket';
import { TicketTable } from '@/components/tickets-table';
import { EditTicketSheet } from '@/components/tickets/EditTicketSheet';
import { useTickets } from '@/hooks/useTickets';
import type { TicketStatus, Ticket } from '@/lib/api';
import { useState } from 'react';
import StatsHeader from "@/components/StatsHeader.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const [statusFilter, setStatusFilter] = useState<TicketStatus>('open');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  const { data: tickets = [], isLoading, isError, error } = useTickets({
    status: statusFilter,
    page_id: currentPage + 1,
    page_size: pageSize,
  });

  const handlePageChange = (pageIndex: number) => {
    if (pageIndex >= 0) {
      setCurrentPage(pageIndex);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  };

  const handleStatusFilterChange = (newStatus: TicketStatus) => {
    setStatusFilter(newStatus);
    setCurrentPage(0);
  };

  const handleRowClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsEditSheetOpen(true);
  };

  const handleEditSheetClose = () => {
    setIsEditSheetOpen(false);
    setSelectedTicket(null);
  };

  return (
    <div className="flex flex-col max-w-6xl my-0 mx-auto p-6">
      <div className="flex items-center justify-between w-full">
        <h1 className="font-semibold text-2xl">Tickets</h1>
        <div className="flex items-center gap-2">
          <CreateTicketForm/>
          <Button role="icon" variant="outline">
            <HugeiconsIcon icon={Sun01Icon}/>
          </Button>
        </div>
      </div>

      <StatsHeader />

      <div className="mt-4">
        <TicketTable
            data={tickets}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onStatusFilterChange={handleStatusFilterChange}
            onRowClick={handleRowClick}
            currentPage={currentPage}
            pageSize={pageSize}
            statusFilter={statusFilter}
        />
      </div>

      <EditTicketSheet
          ticket={selectedTicket}
          isOpen={isEditSheetOpen}
          onClose={handleEditSheetClose}
      />
    </div>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster>
        <AppContent />
      </Toaster>
    </QueryClientProvider>
  );
}

export default App;