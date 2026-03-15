import { Button } from "./button"
import { ChevronDown } from "lucide-react"
import { Filter } from "../table/controller"
import { X } from "lucide-react"

export default function FiltersLine({ filters, removeFilter }: { filters: Filter[], removeFilter: (id: string) => void }) {
    return (
        <>
        {
            filters.map((filter) => (
                <div key={filter.id} className="flex items-center space-x-2 min-w-[80px] ml-2 p-2">
                    <div className="flex items-center space-x-2 hover:text-violet-300 transition-colors cursor-pointer">
                        <span className="text-[10px] font-medium max-w-[80px] shrink-0">{filter.name}</span>
                        <ChevronDown size={10} className="text-zinc-500" />
                    </div>
                    <Button
                        onClick={() => removeFilter(filter.id)}
                        className="text-zinc-500 hover:text-white transition-colors shrink-0 bg-zinc-900 w-6 h-6 cursor-pointer"
                    >
                        <X size={10} />
                    </Button>
                </div>
            ))
        }
        </>
    )
}