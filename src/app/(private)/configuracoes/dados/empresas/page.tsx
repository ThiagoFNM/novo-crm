'use client';

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutGrid, ListChecks, Tags, GitBranch, Ellipsis, Edit, Trash } from "lucide-react"
import { useState } from "react"
import { useEmpresasStatus } from "@/hooks/empresa/use-empresas-status";
import { Button } from "@/components/ui/button";
import { FormStatus } from "@/components/form/configuracoes/statusEmpresas/status";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { UpdateEmpresaStatusDatTypes } from "@/service/empresa/empresaStatus";

function MenuDadosEmpresas({ setCampoSelecionado, campoSelecionado }: { setCampoSelecionado: (campo: string) => void, campoSelecionado: string }) {

    const dataMenuLinks = [
        {
            label: "Campos",
            icon: LayoutGrid
        },
        {
            label: "Status",
            icon: ListChecks
        },
        {
            label: "Tags",
            icon: Tags
        },
        {
            label: "Pipelines",
            icon: GitBranch
        }
    ]


    return (
        <SidebarGroup className="p-0">
            <SidebarGroupLabel className="px-0">Editar dados de empresas:</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuSub className="mx-0 px-4 flex flex-row gap-4">
                        {dataMenuLinks.map((link) => (
                            <SidebarMenuSubItem key={link.label}>
                                <SidebarMenuSubButton asChild>
                                    <span onClick={() => setCampoSelecionado(link.label)} className={cn("cursor-pointer border-border border-r hover:opacity-30 transition-opacity duration-200", campoSelecionado === link.label && "text-violet-600")}>
                                        <link.icon className={cn("w-4 h-4", campoSelecionado === link.label && "text-violet-600!")} />
                                        {link.label}
                                    </span>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    )
}

export default function ConfigDadosEmpresasPage() {
    const [campoSelecionado, setCampoSelecionado] = useState("")
    const { query: empresasStatus, deleteMutation, updateMutation } = useEmpresasStatus()
    const [editMode, setEditMode] = useState(false)
    const [statusToEdit, setStatusToEdit] = useState<UpdateEmpresaStatusDatTypes | null>(null)

    return (
        <section className="p-4 flex flex-col gap-4">
            <div>
                <h1>Configurações de Empresas</h1>
                <p className="text-muted-foreground">Gerencie os campos, status, tags e pipelines das empresas.</p>
            </div>

            <div>
                <MenuDadosEmpresas setCampoSelecionado={setCampoSelecionado} campoSelecionado={campoSelecionado} />
            </div>

            <div className="w-250">
                {campoSelecionado === "Status" && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold">Status</h2>
                            <FormStatus />
                        </div>
                        <Table className="border border-border w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Cor</TableHead>
                                    <TableHead>Ativo</TableHead>
                                    <TableHead>Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {empresasStatus?.data?.map((status: any) => (
                                    <TableRow key={status.id} className="hover:bg-zinc-200 ">
                                        <TableCell className="cursor-pointer" onClick={() => { setEditMode(true); setStatusToEdit(status) }}>{status.status}</TableCell>
                                        <TableCell className="cursor-pointer" onClick={() => { setEditMode(true); setStatusToEdit(status) }}>
                                            <div className={`w-4 h-4 rounded-full ${status.cor}`}></div>
                                        </TableCell>
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <Switch
                                                className="cursor-pointer"
                                                checked={status.ativo}
                                                onCheckedChange={() => updateMutation.mutate({ id: status.id, data: { ativo: !status.ativo } })}
                                            />
                                        </TableCell>
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <Ellipsis className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="start">
                                                    <DropdownMenuItem className="cursor-pointer" onClick={() => { setEditMode(true); setStatusToEdit(status) }}>
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-100 cursor-pointer" onClick={() => updateMutation.mutate({ id: status.id, data: { ativo: false } })}>
                                                        <Trash className="w-4 h-4 mr-2" />
                                                        Excluir
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <FormStatus 
                            editMode={true} 
                            open={editMode} 
                            onOpenChange={setEditMode} 
                            status={statusToEdit || undefined} 
                        />
                    </div>
                )}
            </div>
        </section>
    )
}