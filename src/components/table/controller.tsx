'use client';

import { PaginationState, Table } from "@tanstack/react-table"
import { Filters } from "./filters"
import FiltersLine from "../ui/filters"
import RegistersPerPage from "./registers-per-page"

export type Filter = {
    id: string;
    name: string;
    type: string;
    value?: string;
}

interface ControllerProps<T> {
    pagination: PaginationState;
    table: Table<T>;
    filters: Filter[];
    setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
}

export function Controller<T>({ pagination, table, filters, setFilters }: ControllerProps<T>) {

    const handleFilterChange = (id: string, value: string) => {
        setFilters(prev => prev.map(f => f.id === id ? { ...f, value } : f));
    }

    const removeFilter = (id: string) => {
        setFilters(prev => prev.filter(f => f.id !== id));
    }

    return (

        <div className="flex items-center space-x-4 w-full h-12 justify-end">
            <div className="flex justify-end items-center space-x-2 overflow-x-auto overflow-y-hidden pb-1 scrollbar-hide no-scrollbar h-full">
                {table.getFilteredSelectedRowModel().rows.length > 0 && (
                    <div className="text-xs text-zinc-300 whitespace-nowrap px-2">
                        {table.getFilteredSelectedRowModel().rows.length} de{" "}
                        {table.getFilteredRowModel().rows.length} selecionadas.
                    </div>
                )}

                <FiltersLine filters={filters} removeFilter={removeFilter} />

                <Filters table={table} filters={filters} setFilters={setFilters} />
            </div>

            <RegistersPerPage table={table} pagination={pagination} />
        </div>
    )
}