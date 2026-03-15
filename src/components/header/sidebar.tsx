import Link from "next/link"
import { Building, Briefcase, Contact, HomeIcon, LucideIcon } from "lucide-react"

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
} from "@/components/ui/sidebar"

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
                    {linksContent.map((link) => (
                        <SidebarMenuItem key={link.href}>
                            <SidebarMenuButton asChild>
                                <Link href={link.href}>
                                    <span className="opacity-50"><link.icon /></span>
                                    <span className="text-sm">{link.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
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




