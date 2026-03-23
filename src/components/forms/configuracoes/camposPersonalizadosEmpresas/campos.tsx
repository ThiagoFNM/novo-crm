'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { FormLabel } from "@/components/ui/form-label"
import { UpdateCamposDataTypes } from "@/service/empresa/empresaCampos"
import { useCamposFormAction } from "@/hooks/empresa/campos/use-campos-form-action"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

export function FormCamposEmpresas({ editMode = false, campo, open: externalOpen, onOpenChange: externalOnOpenChange }: { editMode?: boolean, campo?: UpdateCamposDataTypes & { id?: number }, open?: boolean, onOpenChange?: (open: boolean) => void }) {
    const [internalOpen, setInternalOpen] = useState(false)
    const open = externalOpen !== undefined ? externalOpen : internalOpen
    const setOpen = externalOnOpenChange || setInternalOpen

    const [camposName, setCamposName] = useState(campo?.nome || "")
    const [entidade, setEntidade] = useState(1)
    const [type, setType] = useState(campo?.tipo || "")
    const [ativo, setAtivo] = useState(campo?.ativo ?? true)
    const [config, setConfig] = useState(campo?.config || "")

    const newData: UpdateCamposDataTypes = { nome: camposName, entidade, tipo: type, ativo, config }

    console.log(newData)

    const { handleSubmit, isPending } = useCamposFormAction({ campo, editMode, setOpen })

    useEffect(() => {
        if (open) {
            setCamposName(campo?.nome || "")
            setEntidade(1)
            setType(campo?.tipo || "")
            setAtivo(campo?.ativo ?? true)
            setConfig(campo?.config || "")
            setErrors({})
        }
    }, [open, campo])

    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleSave = () => {
        handleSubmit({
            data: newData,
            reset: () => {
                setCamposName("")
                setEntidade(1)
                setType("custom")
                setAtivo(true)
                setConfig("")
            },
            setErrors,
        })
    }

    const typesMap = {
        "text": "Texto",
        "number": "Número",
        "email": "Email",
        "phone": "Telefone",
        "date": "Data",
        "datetime": "Data e Hora",
        "textarea": "Área de Texto",
        "select": "Seleção",
        "multiselect": "Seleção Múltipla",
        "checkbox": "Checkbox",
        "radio": "Rádio",
        "file": "Arquivo",
        "image": "Imagem",
        "url": "URL",
        "money": "Dinheiro",
        "percentage": "Porcentagem",
        "rating": "Avaliação",
        "switch": "Switch",
        "toggle": "Toggle",
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {!editMode && (
                <DialogTrigger asChild>
                    <Button variant="controller">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Campo Personalizado
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={(e) => {
                    e.preventDefault()
                    handleSave()
                }}>
                    <DialogHeader>
                        <DialogTitle>{editMode ? "Editar Campo Personalizado" : "Novo Campo Personalizado"}</DialogTitle>

                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-2">
                            <FormLabel required>
                                Nome do Campo Personalizado
                            </FormLabel>
                            <Input
                                value={camposName}
                                onChange={(e) => setCamposName(e.target.value)}
                                placeholder="Ex: Em andamento"
                            />
                            {errors.nome && <p className="text-red-500">{errors.nome}</p>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <FormLabel required>
                                Tipo de Campo
                            </FormLabel>
                            {/* data type atual */}
                            <Select
                                value={type}
                                onValueChange={setType}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent position="popper" align="start">
                                    {Object.entries(typesMap).map(([key, value]) => (
                                        <SelectItem key={key} value={key}>
                                            {value}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.tipo && <p className="text-red-500">{errors.tipo}</p>}

                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium">Ativo</label>
                                <Switch
                                    checked={ativo}
                                    onCheckedChange={setAtivo}
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