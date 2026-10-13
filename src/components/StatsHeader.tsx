import {StatCardSkeleton} from "@/components/StatCardSkeleton.tsx";
import StatCard from "@/components/stat-card.tsx";
import {
    CheckUnread02Icon,
    FolderOpenDotFreeIcons,
    Progress02FreeIcons,
    Summation01FreeIcons
} from "@hugeicons/core-free-icons";
import {useTicketStats} from "@/hooks/useTickets.ts";

export default function StatsHeader() {
    const { data: stats, isLoading: statsLoading } = useTicketStats();

    return <div className="flex gap-2 flex-col md:flex-row mt-8 w-full">
        {statsLoading ? (
            <>
                <StatCardSkeleton/>
                <StatCardSkeleton/>
                <StatCardSkeleton/>
                <StatCardSkeleton/>
            </>
        ) : (
            <>
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
            </>
        )}
    </div>
}