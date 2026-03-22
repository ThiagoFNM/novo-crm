'use client'

import { usePathname } from "next/navigation"
import AppSidebar from "@/components/menu/menu-principal/sidebar"
import AppSidebarConfiguracoes from "@/components/menu/menu-configuracoes/sidebar"
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/hooks/use-queryclient"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

function MainContent({ children }: { children: React.ReactNode }) {
    const { state, setOpen, isMobile } = useSidebar()

    return (
        <main 
            className="bg-zinc-100 border-r border-zinc-800 w-full h-screen text-zinc-950 overflow-y-auto"
            
            // onClick={() => {
            //     if (state === "expanded" && !isMobile) {
            //         setOpen(false)
            //     }
            // }}
        >
            <SidebarTrigger className="text-zinc-950 hover:text-zinc-600" />
            {children}
        </main>
    )
}

export default function SystemLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isConfigPage = pathname.startsWith("/configuracoes")

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <SidebarProvider className="w-full">
                    <header className="bg-zinc-950 h-screen">
                        {isConfigPage ? <AppSidebarConfiguracoes /> : <AppSidebar />}
                    </header>

                    <MainContent>
                        {children}
                    </MainContent>
                    <Toaster 
                        toastOptions={{
                            classNames: {
                                success: "bg-green-300! text-zinc-950!",
                                title: "text-zinc-950! font-bold!",
                                description: "text-zinc-950! font-light",
                                error: "bg-red-300! text-zinc-950!",
                                warning: "bg-yellow-300! text-zinc-950!",
                                info: "bg-blue-300! text-zinc-950!",
                            },
                            duration: 5000,
                        }}
                    />
                </SidebarProvider>
            </TooltipProvider>
        </QueryClientProvider>
    )
}
