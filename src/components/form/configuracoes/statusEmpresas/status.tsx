'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { useEmpresasStatus } from "@/hooks/empresa/use-empresas-status"
import { Plus } from "lucide-react"
import { z } from "zod"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { UpdateEmpresaStatusDatTypes } from "@/service/empresa/empresaStatus"

const statusSolidColors = [
    "bg-red-500", "bg-green-500", "bg-blue-500", "bg-yellow-500", "bg-purple-500",
    "bg-pink-500", "bg-orange-500", "bg-cyan-500", "bg-lime-500", "bg-indigo-500",
    "bg-violet-500", "bg-fuchsia-500", "bg-rose-500", "bg-emerald-500", "bg-teal-500",
    "bg-sky-500", "bg-slate-500", "bg-gray-500", "bg-zinc-500", "bg-neutral-500",
]

function FormLabel({ children, required }: { children: React.ReactNode, required?: boolean }) {
    return (
        <label className="text-sm font-medium">
            {children}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
    )
}

const statusSchema = z.object({
    status: z.string().nonempty("Nome do status é obrigatório"),
    cor: z.string().nonempty("Cor é obrigatória"),
    ativo: z.boolean().optional(),
})

function getChanges(oldData: UpdateEmpresaStatusDatTypes = {}, newData: UpdateEmpresaStatusDatTypes) {
    const changes: UpdateEmpresaStatusDatTypes = {}
    if (oldData.status !== newData.status) {
        changes.status = newData.status
    }
    if (oldData.cor !== newData.cor) {
        changes.cor = newData.cor
    }
    if (oldData.ativo !== newData.ativo) {
        changes.ativo = newData.ativo
    }
    return changes
}

export function FormStatus({ editMode = false, status, open: externalOpen, onOpenChange: externalOnOpenChange }: { editMode?: boolean, status?: UpdateEmpresaStatusDatTypes & { id?: number }, open?: boolean, onOpenChange?: (open: boolean) => void }) {
    const { createMutation, updateMutation } = useEmpresasStatus()
    const [internalOpen, setInternalOpen] = useState(false)
    const open = externalOpen !== undefined ? externalOpen : internalOpen
    const setOpen = externalOnOpenChange || setInternalOpen

    const [statusName, setStatusName] = useState(status?.status || "")
    const [color, setColor] = useState(status?.cor || "bg-zinc-500")
    const [active, setActive] = useState(status?.ativo ?? true)

    useEffect(() => {
        if (open) {
            setStatusName(status?.status || "")
            setColor(status?.cor || "bg-zinc-500")
            setActive(status?.ativo ?? true)
            setErrors({})
        }
    }, [open, status])

    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleSave = () => {

        const newData = { status: statusName, cor: color, ativo: active }
        const changes = getChanges(status || {}, newData)
        const hasChanges = Object.keys(changes).length > 0

        if (editMode && !hasChanges) {
            toast.info("Nenhuma alteração foi feita", {
                description: "Nenhuma alteração foi feita",
            })
            return
        }

        const result = statusSchema.safeParse({
            status: statusName,
            cor: color,
            ativo: active,
        })

        if (!result.success) {
            const formattedErrors = result.error.issues.reduce((acc, issue): Record<string, string> => {
                acc[String(issue.path[0])] = issue.message
                return acc
            }, {} as Record<string, string>)
            toast.error("Erro ao adicionar status", {
                description: "Verifique os campos",
            })
            setErrors(formattedErrors)
            return
        }

        if (editMode && status?.id) {
            updateMutation.mutate(
                {
                    id: status.id,
                    data: changes
                },
                {
                    onSuccess: () => setOpen(false)
                }

            )

            toast.success("Status atualizado com sucesso", {
                description: "O status foi atualizado com sucesso",
            })
        } else {
            createMutation.mutate(
                { status: statusName, cor: color, ativo: true },
                { onSuccess: () => { setOpen(false); setStatusName(""); setColor("bg-zinc-500") } }
            )
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {!editMode && (
                <DialogTrigger asChild>
                    <Button variant="controller">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Status
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={(e) => {
                    e.preventDefault()
                    handleSave()
                }}>
                    <DialogHeader>
                        <DialogTitle>{editMode ? "Editar Status" : "Novo Status"}</DialogTitle>

                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-2">
                            <FormLabel required>
                                Nome do Status
                            </FormLabel>
                            <Input
                                value={statusName}
                                onChange={(e) => setStatusName(e.target.value)}
                                placeholder="Ex: Em andamento"
                            />
                            {errors.status && <p className="text-red-500">{errors.status}</p>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <FormLabel required>
                                Cor
                            </FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal flex gap-2 h-10">
                                        <div className={`w-4 h-4 rounded-full ${color}`} />
                                        <span>Selecionar cor</span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64">
                                    <div className="grid grid-cols-5 gap-2">
                                        {statusSolidColors.map((c) => (
                                            <div
                                                key={c}
                                                onClick={() => setColor(c)}
                                                className={`${c} w-8 h-8 rounded-full cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-offset-zinc-950 transition-all ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-950' : ''}`}
                                            />
                                        ))}
                                    </div>
                                </PopoverContent>
                                {errors.cor && <p className="text-red-500">{errors.cor}</p>}
                            </Popover>

                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium">Ativo</label>
                                <Switch
                                    checked={active}
                                    onCheckedChange={setActive}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter >
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="ml-1">
                            {createMutation.isPending || updateMutation.isPending ? "Salvando..." : "Salvar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}