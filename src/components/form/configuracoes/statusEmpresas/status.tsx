'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { useStatusFormAction, getChanges } from "@/hooks/status/use-empresas-status"
import { Plus } from "lucide-react"
import { Switch } from "@/components/ui/switch"
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

export function FormStatus({ editMode = false, status, open: externalOpen, onOpenChange: externalOnOpenChange }: { editMode?: boolean, status?: UpdateEmpresaStatusDatTypes & { id?: number }, open?: boolean, onOpenChange?: (open: boolean) => void }) {
    const [internalOpen, setInternalOpen] = useState(false)
    const open = externalOpen !== undefined ? externalOpen : internalOpen
    const setOpen = externalOnOpenChange || setInternalOpen

    const [statusName, setStatusName] = useState(status?.status || "")
    const [color, setColor] = useState(status?.cor || "bg-zinc-500")
    const [active, setActive] = useState(status?.ativo ?? true)

    const newData: UpdateEmpresaStatusDatTypes = { status: statusName, cor: color, ativo: active }

    const { handleSubmit, isPending } = useStatusFormAction({ status, editMode, setOpen })

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
        handleSubmit({
            data: newData,
            reset: () => {
                setStatusName("")
                setColor("bg-zinc-500")
                setActive(true)
            },
            setErrors,
        })
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
                        <Button type="submit" disabled={isPending} className="ml-1">
                            {isPending ? "Salvando..." : "Salvar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}