import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ToggleColumns } from "./toggle-columns";
import { type Table, type PaginationState } from "@tanstack/react-table";

export default function RegistersPerPage<TData>({ table, pagination }: { table: Table<TData>; pagination: PaginationState }) {
    return (
        <div className="flex items-center space-x-2 shrink-0">
            <ToggleColumns table={table} />
            <Select
                value={pagination.pageSize.toString()}
                onValueChange={(value: string) => table.setPageSize(Number(value))}
            >
                <SelectTrigger className="w-[180px] cursor-pointer bg-zinc-100 border-border text-zinc-950 hover:bg-zinc-200 transition-colors duration-200">
                    <SelectValue placeholder="10 por página" />
                </SelectTrigger>
                <SelectContent className="w-fit top-10 bg-zinc-950/90 border-zinc-800 text-white shadow-2xl">
                    <SelectItem value="25" className="cursor-pointer focus:bg-zinc-800 focus:text-violet-300 hover:bg-zinc-800 hover:text-white transition-colors">25 por página</SelectItem>
                    <SelectItem value="50" className="cursor-pointer focus:bg-zinc-800 focus:text-violet-300 hover:bg-zinc-800 hover:text-white transition-colors">50 por página</SelectItem>
                    <SelectItem value="100" className="cursor-pointer focus:bg-zinc-800 focus:text-violet-300 hover:bg-zinc-800 hover:text-white transition-colors">100 por página</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}