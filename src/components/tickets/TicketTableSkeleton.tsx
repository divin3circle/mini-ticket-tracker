import { Skeleton } from '@/components/ui/skeleton';

export function TicketTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Skeleton variant="rectangular" width="120" height={36} />
        <Skeleton variant="rectangular" width="100" height={36} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b">
              <th className="h-10 px-3 text-left align-middle font-medium text-muted-foreground">
                <Skeleton variant="text" width="30" />
              </th>
              <th className="h-10 px-3 text-left align-middle font-medium text-muted-foreground">
                <Skeleton variant="text" width="60" />
              </th>
              <th className="h-10 px-3 text-left align-middle font-medium text-muted-foreground">
                <Skeleton variant="text" width="80" />
              </th>
              <th className="h-10 px-3 text-left align-middle font-medium text-muted-foreground">
                <Skeleton variant="text" width="50" />
              </th>
              <th className="h-10 px-3 text-left align-middle font-medium text-muted-foreground">
                <Skeleton variant="text" width="50" />
              </th>
              <th className="h-10 px-3 text-left align-middle font-medium text-muted-foreground">
                <Skeleton variant="text" width="70" />
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="border-b">
                <td className="p-3 align-middle"><Skeleton variant="text" width="30" /></td>
                <td className="p-3 align-middle"><Skeleton variant="text" width="120" /></td>
                <td className="p-3 align-middle"><Skeleton variant="text" width="150" /></td>
                <td className="p-3 align-middle"><Skeleton variant="circular" width="80" height={24} /></td>
                <td className="p-3 align-middle"><Skeleton variant="circular" width="80" height={24} /></td>
                <td className="p-3 align-middle"><Skeleton variant="text" width="90" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <Skeleton variant="text" width="200" />
        <div className="flex items-center gap-2">
          <Skeleton variant="rectangular" width="80" height={36} />
          <Skeleton variant="rectangular" width="80" height={36} />
        </div>
      </div>
    </div>
  );
}