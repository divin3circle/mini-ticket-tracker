import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Sun01Icon, Summation01FreeIcons, FolderOpenDotFreeIcons, Progress02FreeIcons, CheckUnread02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import StatCard from '@/components/stat-card';
import CreateTicketForm from '@/components/create-ticket';
import { TicketTable } from '@/components/tickets-table';
import { useTickets, useTicketStats } from '@/hooks/useTickets';
import type { TicketStatus } from '@/lib/api';
import { useState } from 'react';

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

  const { data: tickets = [], isLoading, isError, error } = useTickets({
    status: statusFilter,
    page_id: currentPage + 1,
    page_size: pageSize,
  });

  const { data: stats } = useTicketStats();

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

  return (
    <div className="flex flex-col max-w-6xl my-0 mx-auto p-6">
      <div className="flex items-center justify-between w-full">
        <h1 className="font-semibold text-2xl">Tickets</h1>
        <div className="flex items-center gap-2">
          <CreateTicketForm />
          <Button role="icon" variant="outline">
            <HugeiconsIcon icon={Sun01Icon} />
          </Button>
        </div>
      </div>

      <div className="flex gap-2 flex-col md:flex-row mt-8 w-full">
        <StatCard
          statItem={{
            title: 'Total',
            items: (stats?.open ?? 0) + (stats?.in_progress ?? 0) + (stats?.closed ?? 0),
            icon: Summation01FreeIcons,
          }}
        />
        <StatCard
          statItem={{
            title: 'Open',
            items: stats?.open ?? 0,
            icon: FolderOpenDotFreeIcons,
          }}
        />
        <StatCard
          statItem={{
            title: 'In Progress',
            items: stats?.in_progress ?? 0,
            icon: Progress02FreeIcons,
          }}
        />
        <StatCard
          statItem={{
            title: 'Closed',
            items: stats?.closed ?? 0,
            icon: CheckUnread02Icon,
          }}
        />
      </div>

      <div className="mt-4">
        <TicketTable
          data={tickets}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onStatusFilterChange={handleStatusFilterChange}
          currentPage={currentPage}
          pageSize={pageSize}
          statusFilter={statusFilter}
        />
      </div>
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