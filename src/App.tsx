import { Button } from "@/components/ui/button"
import {
    Sun01Icon,
    Summation01FreeIcons,
    FolderOpenDotFreeIcons,
    Progress02FreeIcons,
    CheckUnread02Icon
} from "@hugeicons/core-free-icons";
import {HugeiconsIcon} from "@hugeicons/react";
import StatCard from "@/components/stat-card.tsx";
import CreateTicketForm from "@/components/create-ticket.tsx";
import {TicketTable} from "@/components/tickets-table.tsx";

const MOCK_STATS = [
    {
        title: "Total",
        items: 84,
        icon: Summation01FreeIcons
    },
    {
        title: "Open",
        items: 44,
        icon: FolderOpenDotFreeIcons
    },
    {
        title: "In Progress",
        items: 14,
        icon: Progress02FreeIcons
    },
    {
        title: "Closed",
        items: 34,
        icon: CheckUnread02Icon
    },

]

export function App() {
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
            {MOCK_STATS.map((item, index) => (
                <StatCard statItem={item} key={index} />
            ))}
        </div>
        <div className="mt-4">
            <TicketTable />
        </div>
    </div>
  )
}

export default App
