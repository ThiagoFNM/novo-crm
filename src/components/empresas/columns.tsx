'use client'

import { ColumnDef } from "@tanstack/react-table"

export type Empresa = {
    id: number
    razaoSocial: string
    cnpjBasico: string
    cnpjOrdem: string
    cnpjDv: string
    dsAtividadeEconomicaPrincipal: string
    vertical: string
    posse: string
    trilha: string
    dominioPublico: boolean
    cep: string
    numeroEndereco: string
    criadoEm: Date
    atualizadoEm: Date
    idHubSpot: number
    parqueProduto: string
    idStatus: number
    status: string
    statusRelacionamento: string
    dtUltimaInteracao: Date
    idProprietario: number
}

export const columns: ColumnDef<Empresa>[] = [
    {
        accessorKey: "razaoSocial",
        header: "Razão Social",
    },
    {
        accessorKey: "cnpjBasico",
        header: "CNPJ Básico",
    },
    {
        accessorKey: "cnpjOrdem",
        header: "CNPJ Ordem",
    },
    {
        accessorKey: "cnpjDv",
        header: "CNPJ DV",
    },
    {
        accessorKey: "dsAtividadeEconomicaPrincipal",
        header: "Atividade Econômica Principal",
    },
    {
        accessorKey: "vertical",
        header: "Vertical",
    },
    {
        accessorKey: "posse",
        header: "Posse",
    },
    {
        accessorKey: "trilha",
        header: "Trilha",
    },
    {
        accessorKey: "dominioPublico",
        header: "Domínio Público",
    },
    {
        accessorKey: "cep",
        header: "CEP",
    },
    {
        accessorKey: "numeroEndereco",
        header: "Número Endereço",
    },
    {
        accessorKey: "criadoEm",
        header: "Criado em",
    },
    {
        accessorKey: "atualizadoEm",
        header: "Atualizado em",
    },
    {
        accessorKey: "idHubSpot",
        header: "ID HubSpot",
    },
    {
        accessorKey: "parqueProduto",
        header: "Parque Produto",
    },
    {
        accessorKey: "idStatus",
        header: "ID Status",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "statusRelacionamento",
        header: "Status Relacionamento",
    },
    {
        accessorKey: "dtUltimaInteracao",
        header: "Data Última Interação",
    },
    {
        accessorKey: "idProprietario",
        header: "ID Proprietário",
    },
]
