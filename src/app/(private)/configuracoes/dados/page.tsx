import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { Building } from "lucide-react"
import Link from "next/link"

export default function ConfigDadosPage() {

    return (

        <section className="p-4 flex flex-col gap-4">
            <div>
                <h1>Configurações de Dados</h1>
            </div>

            <div>
                <SidebarGroup>
                    <SidebarGroupLabel>Editar dados de:</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>

                                <Link href="/configuracoes/dados/empresas">
                                    <Building />
                                    Empresas
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </div>

        </section>
    )
}