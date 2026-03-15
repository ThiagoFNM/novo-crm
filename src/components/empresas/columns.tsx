'use client'

import { ColumnDef } from "@tanstack/react-table"
import { cellCNPJ, cellData, booleanCells, cellCEP, cellProprietario, cellStatus } from "@/lib/formatacoes/celulas"
import { Empresa } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"

export const columnsEmpresas: ColumnDef<Empresa>[] = [
    {
        id: "checkbox",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-0.5"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-0.5"
            />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 50,
        maxSize: 50,
        minSize: 50,
        meta: {
            type: "select",
            draggable: false,
            isResizable: false,
            isEllipsis: false,
            cellAlign: 'center',
            headerAlign: 'center',
            filterable: false
        }
    },
    {
        accessorKey: "razaoSocial",
        header: "Razão Social",
        size: 500,
        maxSize: 600,
        minSize: 200,
        meta: {
            type: "text",
            isResizable: true,
            isEllipsis: false,
            filterable: true,
            filterType: "text",
            draggable: true,
            keyRegister: true
        }
    },
    {
        accessorKey: "cnpj",
        header: "CNPJ",
        maxSize: 200,
        minSize: 200,
        size: 200,
        meta: {
            type: "text",
            isResizable: false,
            isEllipsis: false,
            cellAlign: 'right',
            filterable: true,
            filterType: "text",
            draggable: true,
            keyRegister: true
        },
        cell: cellCNPJ("cnpj")
    },
    {
        accessorKey: "dsAtividadeEconomicaPrincipal",
        header: "Atividade Econômica",
        size: 500,
        maxSize: 900,
        minSize: 200,
        meta: {
            type: "text",
            isResizable: true,
            isEllipsis: false,
            draggable: true
        }
    },
    {
        accessorKey: "vertical",
        header: "Vertical",
        size: 200,
        maxSize: 200,
        minSize: 200,
        meta: {
            type: "text",
            isResizable: false,
            isEllipsis: false,
            draggable: true
        }
    },
    {
        accessorKey: "posse",
        header: "Posse",
        size: 200,
        maxSize: 800,
        minSize: 200,
        meta: {
            type: "text",
            isResizable: true,
            isEllipsis: false,
            cellAlign: 'left',
            draggable: true
        }
    },
    {
        accessorKey: "trilha",
        header: "Trilha",
        meta: {
            type: "text",
            isResizable: false,
            isEllipsis: false,
            cellAlign: 'left',
            draggable: true
        }
    },
    {
        accessorKey: "dominioPublico",
        header: "Domínio Público",
        cell: booleanCells("dominioPublico"),
        meta: {
            type: "boolean",
            isResizable: false,
            isEllipsis: false,
            cellAlign: 'right',
            draggable: true
        }
    },
    {
        accessorKey: "cep",
        header: "CEP",
        cell: cellCEP("cep"),
        meta: {
            type: "text",
            isResizable: false,
            isEllipsis: false,
            cellAlign: 'right',
            filterable: true,
            filterType: "text",
            draggable: true
        }
    },
    {
        accessorKey: "numeroEndereco",
        header: "Número Endereço",
        size: 150,
        maxSize: 150,
        minSize: 150,
        meta: {
            type: "text",
            isResizable: false,
            isEllipsis: false,
            cellAlign: 'right',
            draggable: true,
            filterable: true,
            filterType: "text",
        }
    },
    {
        accessorKey: "criadoEm",
        header: "Criado em",
        cell: cellData("criadoEm"),
        meta: {
            type: "date",
            isResizable: false,
            isEllipsis: false,
            cellAlign: 'right',
            draggable: true,
            filterable: true,
            filterType: "date",
        }
    },
    {
        accessorKey: "atualizadoEm",
        header: "Atualizado em",
        cell: cellData("atualizadoEm"),
        meta: {
            type: "date",
            isResizable: false,
            isEllipsis: false,
            cellAlign: 'right',
            draggable: true,
            filterable: true,
            filterType: "date",
        }
    },
    {
        accessorKey: "idHubSpot",
        header: "ID HubSpot",
        meta: {
            type: "number",
            isResizable: false,
            isEllipsis: false,
            cellAlign: 'right',
            draggable: true
        }
    },
    {
        accessorKey: "parqueProduto",
        header: "Parque Produto",
        size: 200,
        maxSize: 200,
        minSize: 200,
        meta: {
            type: "text",
            isResizable: false,
            isEllipsis: false,
            cellAlign: 'left',
            draggable: true
        }
    },
    {
        accessorKey: "idStatus",
        header: "ID Status",
        meta: {
            type: "number",
            isResizable: false,
            isEllipsis: false,
            cellAlign: 'right',
            draggable: true
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: cellStatus("status"),
        size: 200,
        maxSize: 200,
        minSize: 200,
        meta: {
            type: "text",
            isResizable: false,
            isEllipsis: false,
            cellAlign: 'left',
            draggable: true
        }
    },
    {
        accessorKey: "statusRelacionamento",
        header: "Status Relacionamento",
        size: 200,
        maxSize: 200,
        minSize: 200,
        meta: {
            type: "text",
            isResizable: false,
            isEllipsis: false,
            cellAlign: 'left',
            draggable: true
        }
    },
    {
        accessorKey: "dtUltimaInteracao",
        header: "Data Última Interação",
        cell: cellData("dtUltimaInteracao"),
        meta: {
            type: "date",
            isResizable: false,
            isEllipsis: false,
            cellAlign: 'right',
            draggable: true,
            filterable: true,
            filterType: "date",
        }
    },
    {
        accessorKey: "idProprietario",
        header: "ID Proprietário",
        cell: cellProprietario("idProprietario"),
        meta: {
            type: "number",
            isResizable: false,
            isEllipsis: false,
            cellAlign: 'right',
            draggable: true,
            filterable: true,
            filterType: "number",
        }
    },
]
