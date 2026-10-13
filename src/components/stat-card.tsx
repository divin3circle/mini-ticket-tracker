import type {IconSvgObject} from "@hugeicons/core-free-icons/types";
import {HugeiconsIcon} from "@hugeicons/react";

interface StatCardProps {
    title: string
    items: number
    icon: IconSvgObject
}

export default function StatCard({ statItem } : {
    statItem: StatCardProps
}){
    return (
        <div className="border w-full md:w-1/4 p-4 border-foreground/10">
           <div className="flex items-center justify-between">
               <p className="font-medium text-foreground/50">{statItem.title}</p>
               <HugeiconsIcon icon={statItem.icon} />
           </div>
            <h1 className="font-semibold mt-2 text-4xl">{statItem.items}</h1>
        </div>
    )
}