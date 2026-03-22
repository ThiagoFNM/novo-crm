
import { Button } from "../ui/button"
import { Plus, X, Search } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { type Table } from "@tanstack/react-table"
import { Filter } from "./controller"
import { cn } from "@/lib/utils"

interface FilterProps<TData> {
    table: Table<TData>
    filters: Filter[]
    setFilters: React.Dispatch<React.SetStateAction<Filter[]>>
}

export function Filters<TData>({ table, filters, setFilters }: FilterProps<TData>) {
    function addFilter(columnId: string) {
        const column = table.getAllColumns().find(col => col.id === columnId)
        const meta = column?.columnDef.meta as { filterType: string }

        if (!filters.find(filter => filter.id === columnId)) {
            setFilters(prev => [...prev, {
                id: columnId,
                name: typeof column?.columnDef.header === "string" ? column.columnDef.header : (column?.id || columnId),
                type: meta?.filterType ? meta.filterType : "text"
            }])
        }
    }

    function clearAllFilters() {
        setFilters([])
    }

    const containFilters = filters.length > 0;

    return (
        <div className="flex items-center space-x-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="controller" size="sm" className="">
                        <Plus size={14} className="mr-2" />
                        <span>Adicionar filtro</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-zinc-900 border-zinc-800 text-zinc-300 shadow-2xl">
                    <DropdownMenuLabel className="text-zinc-500 font-normal">Campos filtráveis</DropdownMenuLabel>
                    {table
                        .getAllColumns()
                        .filter(column => (column.columnDef.meta as { filterable: boolean })?.filterable)
                        .map(column => {
                            const alreadySelected = filters.find(filter => filter.id === column.id)
                            return (
                                <DropdownMenuItem
                                    key={column.id}
                                    onClick={() => !alreadySelected && addFilter(column.id)}
                                    className={cn("cursor-pointer focus:text-violet-300 transition-colors", alreadySelected && "opacity-50 cursor-not-allowed")}
                                >
                                    <Search size={12} className="mr-2 opacity-50 text-zinc-500" />
                                    <span>
                                        {typeof column.columnDef.header === "string"
                                            ? column.columnDef.header
                                            : column.id}
                                    </span>
                                </DropdownMenuItem>
                            )
                        })}

                </DropdownMenuContent>
            </DropdownMenu>

            <Button
                variant="controller"
                size="sm"
                onClick={clearAllFilters}
                className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10 shadow-none border-none"
                disabled={!containFilters}
            >
                <X size={14} className="mr-2" />
                <span>Limpar filtros</span>
            </Button>
        </div>
    )
}