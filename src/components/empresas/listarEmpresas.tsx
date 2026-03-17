'use client';

import { useState } from "react"
import { useEmpresas } from "@/hooks/empresa/use-empresas"
import { flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, getSortedRowModel, SortingState } from "@tanstack/react-table"
import { columnsEmpresas } from "./columns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, ArrowUpDown, GripHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverlay
} from '@dnd-kit/core';
import {
    SortableContext,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { SortableHeader } from "../ui/sortable-header";
import { Controller } from "../table/controller";

export default function ListarEmpresas() {
    const [pagination, setPagination] = useState({
        pageIndex: 0, // table state is 0-indexed
        pageSize: 25,
    })

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnOrder, setColumnOrder] = useState<string[]>([
        "checkbox",
        ...columnsEmpresas.map(column => (column as any).id ?? (column as any).accessorKey as string)
    ])

    const [activeColumn, setActiveColumn] = useState<string | null>(null)
    const [rowSelection, setRowSelection] = useState({})
    const [filters, setFilters] = useState<any[]>([])

    const sort = sorting.length > 0 ? sorting[0].id : "criadoEm";
    const order = sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "desc";


    const { data, isLoading, isError } = useEmpresas(pagination.pageIndex + 1, pagination.pageSize, sort, order, filters)

    // A requisição axios no getEmpresas retorna os dados dentro de data.empresas (retorno da API: { empresas: [], total: 0 })
    // Como a resposta do axios tem o formato { data: { empresas: [], total: 0 } } precisamos acessar data.data.empresas
    const tableData = data?.data?.empresas || []
    const totalRegistros = data?.data?.total || 0;
    const pageCount = Math.ceil(totalRegistros / pagination.pageSize);


    function moveColumn(columnID: string, targetId: string) {
        const newOrder = [...columnOrder]
        const fromIndex = newOrder.indexOf(columnID)
        const toIndex = newOrder.indexOf(targetId)

        if (toIndex === -1 || fromIndex === -1) return;

        if (activeColumn === 'checkbox') return;
        if (targetId === 'checkbox') return;

        newOrder.splice(fromIndex, 1)
        newOrder.splice(toIndex, 0, columnID)
        setColumnOrder(newOrder)
    }

    function handleDragStart(event: DragStartEvent) {
        setActiveColumn(event.active.id as string)
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor)
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!active || !over) return;
        if (active.id === 'select') return;
        if (over.id === 'select') return;

        if (active && over && active.id !== over.id) {
            moveColumn(active.id as string, over.id as string);
        }
    }

    const table = useReactTable({
        data: tableData,
        columns: columnsEmpresas,
        pageCount: pageCount,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        columnResizeMode: "onChange",
        manualPagination: true,
        manualSorting: true,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnOrderChange: setColumnOrder,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            pagination,
            columnOrder,
            rowSelection
        }
    })

    type ColumnMeta = {
        type: string;
        isResizable: boolean;
        isEllipsis: boolean;
        cellAlign?: 'right' | 'left' | 'center';
        draggable?: boolean;
        headerAlign?: 'right' | 'left' | 'center';
        filterable?: boolean;
        filterType?: 'text' | 'number' | 'date' | 'boolean' | 'selected';
        keyRegister?: boolean;
    }

    const activeHeader = table.getFlatHeaders().find(h => h.column.id === activeColumn)

    return (
        <div className="w-screen flex flex-col h-[calc(100vh-64px)] overflow-hidden">
            <div className="flex">
                <h1 className="text-xl font-bold">Empresas</h1>
            </div>
            <div className="flex w-full items-center justify-between p-4 relative z-20">

                <Controller pagination={pagination} table={table} filters={filters} setFilters={setFilters} />

            </div>
            {isLoading && <p className="px-4">Carregando...</p>}
            {isError && <p className="px-4">Erro ao carregar empresas</p>}
            {data && (
                <div className="flex-1 overflow-auto mx-4 border border-zinc-800 rounded-md">
                    <DndContext
                        collisionDetection={closestCenter}
                        modifiers={[restrictToHorizontalAxis]}
                        onDragEnd={handleDragEnd}
                        onDragStart={handleDragStart}
                        sensors={sensors}
                    >
                        <Table style={{ width: table.getTotalSize(), tableLayout: "fixed" }}>
                            <TableHeader className="bg-zinc-950 sticky top-0 z-10">
                                {table.getHeaderGroups().map(headerGroup => (
                                    <TableRow key={headerGroup.id}>
                                        <SortableContext
                                            items={table.getHeaderGroups().map(headerGroup => headerGroup.id)}
                                            strategy={horizontalListSortingStrategy}
                                        >
                                            {headerGroup.headers.map(header => {
                                                const meta = header.column.columnDef.meta as ColumnMeta;

                                                return (
                                                    <SortableHeader
                                                        key={header.id}
                                                        header={header}
                                                        meta={meta}
                                                        dragHandle={meta?.draggable ? <GripHorizontal size={14} className="hover:text-violet-300" /> : null}
                                                        className={cn(
                                                            "text-white/60 font-light relative group cursor-pointer bg-zinc-800",
                                                            meta?.isEllipsis && "truncate",

                                                        )}
                                                        style={{ width: header.getSize() }}
                                                    >
                                                        <div className="flex items-center p-0.5 hover:text-violet-300 transition-colors duration-200 ">

                                                            <div
                                                                className="flex items-center cursor-pointer select-none"
                                                                onClick={() => header.column.getCanSort() && header.column.toggleSorting()}
                                                            >
                                                                <span className="whitespace-pre-wrap leading-tight">
                                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                                </span>

                                                                <span>
                                                                    {header.column.getIsSorted() === "asc" && header.column.getCanSort() ? (
                                                                        <ArrowUp className="mr-4 ml-2 h-3 w-3" />
                                                                    ) : header.column.getIsSorted() === "desc" && header.column.getCanSort() ? (
                                                                        <ArrowDown className="mr-4 ml-2 h-3 w-3" />
                                                                    ) : header.column.getCanSort() ? (
                                                                        <ArrowUpDown className="mr-4 ml-2 h-3 w-3" />
                                                                    ) : null}
                                                                </span>
                                                            </div>

                                                            {header.column.getCanResize() && meta?.isResizable !== false && (
                                                                <div
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    onDragStart={(e) => e.stopPropagation()}
                                                                    onDragEnd={(e) => e.stopPropagation()}
                                                                    onDragOver={(e) => e.stopPropagation()}
                                                                    onDragLeave={(e) => e.stopPropagation()}
                                                                    onDrop={(e) => e.stopPropagation()}
                                                                    onDoubleClick={(e) => e.stopPropagation()}
                                                                    onMouseDown={header.getResizeHandler()}
                                                                    onTouchStart={header.getResizeHandler()}
                                                                    className={`absolute flex items-center justify-center right-0 top-0 h-full w-6 cursor-col-resize select-none touch-none bg-zinc-600 text-zinc-400 hover:bg-violet-300 hover:text-white transition-colors duration-200 p-2 ${header.column.getIsResizing()
                                                                        ? "bg-zinc-500 opacity-100"
                                                                        : "bg-transparent"
                                                                        }`}
                                                                >
                                                                    <span className="flex items-center justify-center"><GripHorizontal size={14} /></span>
                                                                </div>


                                                            )}
                                                        </div>
                                                    </SortableHeader>

                                                );
                                            })}
                                        </SortableContext>
                                    </TableRow>
                                ))}
                            </TableHeader>

                            <TableBody>
                                {table.getRowModel().rows.map(row => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map(cell => {
                                            const meta = cell.column.columnDef.meta as ColumnMeta;
                                            return (
                                                <TableCell
                                                    key={cell.id}
                                                    style={{ width: cell.column.getSize() }}
                                                    className={cn(
                                                        "overflow-hidden border-zinc-800 border font-light",
                                                        meta?.isEllipsis && "truncate",
                                                        meta?.keyRegister && "text-blue-200 underline font-medium",
                                                    )}
                                                    align={meta?.cellAlign || "left"}
                                                >
                                                    <span className="cursor-pointer">{flexRender(cell.column.columnDef.cell, cell.getContext())}</span>
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <DragOverlay>
                            {activeColumn && (
                                <div
                                    className={cn(
                                        "text-violet-300 font-light relative group cursor-pointer bg-zinc-800",
                                        "border-r border-zinc-700",
                                        "min-w-[100px] max-w-[300px]",
                                        "h-10 px-3 py-2 text-left text-sm font-medium",
                                        "bg-zinc-900 border-zinc-700",
                                        "cursor-grabbing",
                                        "shadow-2xl z-50",
                                        "flex items-center justify-between"
                                    )}
                                >
                                    {activeHeader &&
                                        flexRender(activeHeader.column.columnDef.header, activeHeader.getContext())
                                    }
                                </div>
                            )}
                        </DragOverlay>
                    </DndContext>
                </div>
            )}


            <div className="flex w-full bg-zinc-900 border-t border-zinc-800 p-4 space-x-4 items-center justify-between mt-auto">
                <div className="text-sm text-zinc-400">
                    Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()} (Total: {totalRegistros})
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="cursor-pointer text-zinc-950 px-6 py-2 h-auto"
                    >
                        Anterior
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="cursor-pointer text-zinc-950 px-6 py-2 h-auto"
                    >
                        Próximo
                    </Button>
                </div>
            </div>
        </div>
    )
}