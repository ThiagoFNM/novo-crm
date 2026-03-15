'use client'

import React, { useState, useEffect } from "react"
import { ChevronDown, X } from "lucide-react"
import { Filter } from "../table/controller"
import InputFilter from "./input-filter"
import { cn } from "@/lib/utils"

export default function FiltersLine({
    filters,
    removeFilter,
    updateFilter
}: {
    filters: Filter[],
    removeFilter: (id: string) => void,
    updateFilter: (id: string, value: string) => void
}) {
    if (!filters || filters.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 cursor-pointer">
            {filters.map((filter) => (
                <FilterBadge
                    key={filter.id}
                    filter={filter}
                    removeFilter={removeFilter}
                    updateFilter={updateFilter}
                />
            ))}
        </div>
    )
}

export type FilterValue = {
    id: string;
    name: string;
    value: string;
    condition?: string;
}

// Criar um componente isolado garante que cada filtro abra apenas o seu próprio dropdown
function FilterBadge({
    filter,
    removeFilter,
    updateFilter
}: {
    filter: Filter,
    removeFilter: (id: string) => void,
    updateFilter: (id: string, value: string) => void
}) {
    const [open, setOpen] = useState(false)

    // Initialize from global state if it exists (JSON parsed)
    const [filterValues, setFilterValues] = useState<FilterValue[]>(() => {
        try {
            return filter.value ? JSON.parse(filter.value) : []
        } catch {
            return []
        }
    })

    // Sync local state if filter.value changes externally
    useEffect(() => {
        try {
            const parsed = filter.value ? JSON.parse(filter.value) : []
            setFilterValues(parsed)
        } catch {
            setFilterValues([])
        }
    }, [filter.value])

    const updateValues = (updater: React.SetStateAction<FilterValue[]>) => {
        const newValues =
            typeof updater === "function"
                ? updater(filterValues)
                : updater

        setFilterValues(newValues)
        updateFilter(filter.id, JSON.stringify(newValues))
    }

    return (
        <div className="relative">
            {/* Badge Container */}
            <div className={cn(`
                flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border transition-colors
                ${open
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800/50 hover:text-violet-300'
                }`,
                filterValues.length > 0 && "border-violet-500 bg-violet-500/20 text-violet-300"
            )}
            onClick={() => setOpen(!open)}
            >
                {/* Botão para abrir o Dropdown */}
                <button
                    className={cn("flex items-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-sm cursor-pointer")}
                >
                    <span className="text-xs font-medium max-w-[120px] truncate ">
                        {filter.name}
                    </span>
                    <ChevronDown
                        size={14}
                        className={`text-zinc-500 transition-transform duration-200 ${open ? 'rotate-180 text-zinc-300' : ''}`}
                    />
                </button>

                {/* Divisor vertical sutil */}
                <div className="w-px h-3 bg-zinc-700 mx-0.5" />

                {/* Botão de Remover */}
                <button
                    onClick={() => removeFilter(filter.id)}
                    className="text-zinc-500 hover:text-red-400 outline-none rounded-full p-0.5 transition-colors focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer"
                    aria-label="Remover filtro"
                >
                    <X size={14} />
                </button>
            </div>

            {open && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpen(false)}
                    />

                    <div className="absolute top-full left-0 mt-2 z-50 min-w-[220px] bg-zinc-900 border border-zinc-800 rounded-md shadow-xl shadow-black/50 p-3 animate-in fade-in zoom-in-95 duration-200">
                        <InputFilter filter={filter} filterValues={filterValues} setFilterValues={updateValues} />
                    </div>
                </>
            )}
        </div>
    )
}