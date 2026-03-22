'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { FormLabel } from "@/components/ui/form-label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePipelineFormAction } from "@/hooks/pipelines/use-pipeline-form-action"
import { UpdatePipelineData } from "@/app/infra/database/pipelines/pipelinesRepository"

const entidades = [
    "Empresa"
]

export function FormPipeline({ editMode = false, pipeline, open: externalOpen, onOpenChange: externalOnOpenChange }: { editMode?: boolean, pipeline?: UpdatePipelineData & { id?: number }, open?: boolean, onOpenChange?: (open: boolean) => void }) {
    const [internalOpen, setInternalOpen] = useState(false)
    const open = externalOpen !== undefined ? externalOpen : internalOpen
    const setOpen = externalOnOpenChange || setInternalOpen

    const [pipelineName, setPipelineName] = useState(pipeline?.nome || "")
    const [entidade, setEntidade] = useState(entidades[0])
    const [active, setActive] = useState(pipeline?.ativo ?? true)

    const newData: UpdatePipelineData = { nome: pipelineName, entidade, ativo: active }

    const { handleSubmit, isPending } = usePipelineFormAction({ pipeline, editMode, setOpen })

    useEffect(() => {
        if (open) {
            setPipelineName(pipeline?.nome || "")
            setEntidade(pipeline?.entidade || entidades[0])
            setActive(pipeline?.ativo ?? true)
            setErrors({})
        }
    }, [open, pipeline])

    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleSave = () => {
        handleSubmit({
            data: newData,
            reset: () => {
                setPipelineName("")
                setEntidade(entidades[0])
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
                        Adicionar Pipeline
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={(e) => {
                    e.preventDefault()
                    handleSave()
                }}>
                    <DialogHeader>
                        <DialogTitle>{editMode ? "Editar Pipeline" : "Novo Pipeline"}</DialogTitle>

                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-2">
                            <FormLabel required>
                                Nome do Pipeline
                            </FormLabel>
                            <Input
                                value={pipelineName}
                                onChange={(e) => setPipelineName(e.target.value)}
                                placeholder="Ex: Em andamento"
                            />
                            {errors.nome && <p className="text-red-500">{errors.nome}</p>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <FormLabel required>
                                Entidade
                            </FormLabel>
                            <Select
                                value={entidade}
                                onValueChange={setEntidade}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecionar entidade" />
                                </SelectTrigger>
                                <SelectContent position="popper" align="start">
                                    {entidades.map((c) => (
                                        <SelectItem key={c} value={c}>
                                            {c}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

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