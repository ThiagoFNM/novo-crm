import Link from "next/link"
import { LucideIcon, SettingsIcon, ArrowLeft, Users, ShieldCheck, Database, ChevronRight } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroupLabel,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    useSidebar,
} from "@/components/ui/sidebar"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

function HeaderMenu() {

    return (
        <SidebarHeader className="px-4 py-3">
            <div className="flex items-center gap-2">
                <span className="text-lg font-bold sub-tracking-1">
                    Configurações
                </span>

            </div>
        </SidebarHeader>
    )
}

type LinkContent = {
    href: string
    label: string
    icon: LucideIcon
}

const linksContent: LinkContent[] = [
    {
        href: "/configuracoes/usuarios",
        label: "Usuários",
        icon: Users
    },
    {
        href: "/configuracoes/permissoes",
        label: "Permissões",
        icon: ShieldCheck
    },
    {
        href: "/configuracoes/dados",
        label: "Dados",
        icon: Database
    }
]

function SidebarMenuHeader() {
    const { isMobile } = useSidebar()
    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel>Navegação</SidebarGroupLabel>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/dashboard">
                                <ArrowLeft className="text-zinc-500" />
                                <span>Sair das Configurações</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
                <SidebarGroupLabel>Sistema</SidebarGroupLabel>
                <SidebarMenu>
                    <Collapsible asChild defaultOpen className="group/collapsible">
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip="Geral">
                                    <SettingsIcon />
                                    <span className="font-semibold">Geral</span>
                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {linksContent.map((link) => (
                                        <SidebarMenuSubItem key={link.href}>
                                            <SidebarMenuSubButton asChild>
                                                <Link href={link.href}>
                                                    <span className="opacity-50"><link.icon size={16} /></span>
                                                    <span className="text-xs">{link.label}</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                </SidebarMenu>
            </SidebarGroup>
        </>
    )
}


export default function AppSidebarConfiguracoes() {
    return (
        <Sidebar className="dark bg-zinc-950 text-zinc-950 border-r border-zinc-800">
            <HeaderMenu />
            <SidebarContent >
                <SidebarMenuHeader />
            </SidebarContent>

            <SidebarFooter />
        </Sidebar>
    )
}




