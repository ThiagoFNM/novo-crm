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
import { LayoutGrid, ListChecks, Tags, GitBranch } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils";
import StatusEmpresas from "@/components/configuracoes/dados/empresas/status";
import PipelinesEmpresas from "@/components/configuracoes/dados/empresas/pipelines";
import CamposEmpresas from "@/components/configuracoes/dados/empresas/campos";

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
            <SidebarGroupLabel className="px-0 mb-2">Editar dados de empresas:</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuSub className="mx-0 px-4 flex flex-row gap-6">
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

    return (
        <section className="p-16 flex flex-col gap-4">
            <div className="flex flex-col my-2">
                <h1 className="text-2xl font-bold leading-relaxed tracking-tight">Configurações de Empresas</h1>
                <p className="text-muted-foreground">Gerencie os campos, status, tags e pipelines das empresas.</p>
            </div>

            <div className="h-20">
                <MenuDadosEmpresas setCampoSelecionado={setCampoSelecionado} campoSelecionado={campoSelecionado} />
            </div>

            <div className="w-full">
                {campoSelecionado === "Status" && (
                    <StatusEmpresas />
                )}

                {campoSelecionado === "Pipelines" && (
                    <PipelinesEmpresas />
                )}

                {campoSelecionado === "Campos" && (
                    <CamposEmpresas />
                )}

                {/* {campoSelecionado === "Tags" && (
                    <TagsEmpresas />
                )} */}
            </div>
        </section>
    )
}