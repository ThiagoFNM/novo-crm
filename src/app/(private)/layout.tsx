'use client'

import AppSidebar from "@/components/header/sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/hooks/use-queryclient"

export default function SystemLayout({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <SidebarProvider className="w-full">
                <AppSidebar />
                <main className="bg-zinc-950 border-r border-zinc-800 w-screen h-screen text-white">
                    <SidebarTrigger />
                    {children}
                </main>
            </SidebarProvider>
        </QueryClientProvider>
    )
}