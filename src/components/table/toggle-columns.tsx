"use client"

import { type Table } from "@tanstack/react-table"
import { Settings2 } from "lucide-react"

import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

export function ToggleColumns<TData>({
  table,
}: {
  table: Table<TData>
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="controller"
          size="sm"
        >
          <Settings2 />
          Colunas
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px] bg-zinc-900 border-zinc-800 text-zinc-200 shadow-2xl">
        <DropdownMenuLabel className="font-normal text-zinc-400">Colunas</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-800" />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize cursor-pointer focus:bg-zinc-800 focus:text-violet-300 transition-colors"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {typeof column.columnDef.header === "string" ? column.columnDef.header : column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
