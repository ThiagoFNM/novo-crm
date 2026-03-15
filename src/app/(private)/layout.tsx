'use client'

import AppSidebar from "@/components/header/sidebar"
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/hooks/use-queryclient"
import { TooltipProvider } from "@/components/ui/tooltip"

function MainContent({ children }: { children: React.ReactNode }) {
    const { state, setOpen, isMobile } = useSidebar()

    return (
        <main 
            className="bg-zinc-950 border-r border-zinc-800 w-full h-screen text-white overflow-y-auto"
            onClick={() => {
                if (state === "expanded" && !isMobile) {
                    setOpen(false)
                }
            }}
        >
            <SidebarTrigger />
            {children}
        </main>
    )
}

export default function SystemLayout({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <SidebarProvider className="w-full">
                    <header className="bg-zinc-950 h-screen">
                        <AppSidebar />
                    </header>

                    <MainContent>
                        {children}
                    </MainContent>
                </SidebarProvider>
            </TooltipProvider>
        </QueryClientProvider>
    )
}