'use client';

import { useState } from "react"
import { useEmpresas } from "@/hooks/use-empresas"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { columns } from "./columns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"



export default function ListarEmpresas() {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const { data, isLoading, isError } = useEmpresas(page, limit)

    // A requisição axios no getEmpresas retorna os dados dentro de data.empresas (retorno da API: { empresas: [], total: 0 })
    // Como a resposta do axios tem o formato { data: { empresas: [], total: 0 } } precisamos acessar data.data.empresas
    const tableData = data?.data?.empresas || []
    
    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })
    return (
        <div className="w-screen">
            <div className="flex w-full">
                <div className="flex w-full">
                    <h1>Listar Empresas</h1>
                </div>

                <Select defaultValue={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
                    <SelectTrigger>
                        <SelectValue placeholder="10 por página" />
                    </SelectTrigger>
                    <SelectContent className="w-fit top-10">
                        <SelectItem value="10">10 por página</SelectItem>
                        <SelectItem value="25">25 por página</SelectItem>
                        <SelectItem value="50">50 por página</SelectItem>
                        <SelectItem value="100">100 por página</SelectItem>
                    </SelectContent>
                </Select>

            </div>
            {isLoading && <p>Carregando...</p>}
            {isError && <p>Erro ao carregar empresas</p>}
            {data && (
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.map(row => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}


            <div className="flex w-full bg-zinc-900 p-4 space-x-4 justify-start">
                <button onClick={() => setPage(page - 1)} disabled={page === 1} className="cursor-pointer">Anterior</button>
                <button onClick={() => setPage(page + 1)} disabled={page * limit >= (data?.data?.total || 0)} className="cursor-pointer">Próximo</button>
            </div>
        </div>
    )
}