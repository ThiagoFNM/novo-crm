import Link from "next/link"
import { Building, Briefcase, Contact, HomeIcon, LucideIcon, SettingsIcon, ChevronRight } from "lucide-react"

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
                    CRM Noatec
                </span>
                <span className="text-xs text-muted-foreground">
                    v1
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
        href: "/empresas",
        label: "Empresas",
        icon: Building
    },
    {
        href: "/negocios",
        label: "Negócios",
        icon: Briefcase
    },
    {
        href: "/contatos",
        label: "Contatos",
        icon: Contact
    }
]

function sideBarSkeleton(dataMenuLinks: any[]) {
    return (
        dataMenuLinks.map((link) => (
            <SidebarMenuItem key={link.href}>
                <SidebarMenuButton asChild>
                    <Link href={link.href}>
                        <link.icon />
                        {link.label}
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        ))
    )
}

function SidebarMenuHeader() {
    const { isMobile } = useSidebar()
    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel>Início</SidebarGroupLabel>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/dashboard">
                                <HomeIcon />
                                Dashboard
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>


            <SidebarGroup>
                <SidebarGroupLabel>Gestão</SidebarGroupLabel>
                <SidebarMenu>
                    <Collapsible asChild defaultOpen className="group/collapsible">
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip="Gestão">
                                    <Briefcase />
                                    <span>Gestão</span>
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

            <SidebarGroup>
                <SidebarGroupLabel>Configurações</SidebarGroupLabel>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/configuracoes">
                                <SettingsIcon />
                                Configurações
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
        </>
    )
}

export default function AppSidebar() {
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




