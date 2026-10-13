import { Skeleton } from '@/components/ui/skeleton';

export function StatCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 bg-card border w-full md:w-1/4 p-4 border-foreground/10">
      <Skeleton variant="text" width="60%" height={16} />
      <Skeleton variant="text" width="30%" height={32} />
    </div>
  );
}