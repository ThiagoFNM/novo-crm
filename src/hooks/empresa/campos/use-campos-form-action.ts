import { toast } from "sonner"
import z from "zod"
import { useEmpresasCampos } from "./use-campos"
import { UpdateCamposDataTypes } from "@/service/empresa/empresaCampos"

export function getChanges(oldData: UpdateCamposDataTypes = {}, newData: UpdateCamposDataTypes) {
    const changes: UpdateCamposDataTypes = {}
    if (oldData.nome !== newData.nome) {
        changes.nome = newData.nome
    }
    if (oldData.ativo !== newData.ativo) {
        changes.ativo = newData.ativo
    }
    if (oldData.config !== newData.config) {
        changes.config = newData.config
    }
    if (oldData.tipo !== newData.tipo) {
        changes.tipo = newData.tipo
    }
    if (oldData.entidade !== newData.entidade) {
        changes.entidade = newData.entidade
    }

    return changes
}

const camposSchema = z.object({
    nome: z.string().nonempty("Nome do campo é obrigatório").min(2, "Nome do campo deve ter pelo menos 2 caracteres").max(50, "Nome do campo deve ter no máximo 50 caracteres"),
    entidade: z.number().min(1, "Entidade é obrigatória"),
    tipo: z.string().min(1, "Tipo é obrigatório").max(50, "Tipo deve ter no máximo 50 caracteres"),
    // data_type: z.string().optional(),
    ativo: z.boolean().optional(),
    config: z.string().optional(),
})
export function useCamposFormAction({ campo, editMode, setOpen }: { campo?: UpdateCamposDataTypes & { id?: number }, editMode: boolean, setOpen: (open: boolean) => void }) {
    const { createMutation, updateMutation } = useEmpresasCampos()

    const handleSubmit = ({
        data,
        reset,
        setErrors
    }: {
        data: UpdateCamposDataTypes,
        reset: () => void,
        setErrors: (errors: Record<string, string>) => void
    }) => {

        const changes = getChanges(campo || {}, data)
        const hasChanges = Object.keys(changes).length > 0

        if (editMode && !hasChanges) {
            toast.info("Nenhuma alteração foi feita")
            return
        }

        const result = camposSchema.safeParse(data)

        if (!result.success) {
            const errors = result.error.issues.reduce<Record<string, string>>((acc, issue) => {
                acc[String(issue.path[0])] = issue.message
                return acc
            }, {})

            setErrors(errors)
            toast.error("Campos inválidos", {
                description: "Corrija os campos destacados",
            })
            return
        }

        if (editMode && campo?.id) {
            updateMutation.mutate(
                { id: String(campo.id), data: changes },
                {
                    onSuccess: () => {
                        toast.success("Atualizado com sucesso")
                        setOpen(false)
                    },
                    onError: (error) => {
                        toast.error("Erro ao atualizar")
                    }
                }
            )
        } else {
            createMutation.mutate(data, {
                onSuccess: () => {
                    toast.success("Criado com sucesso")
                    setOpen(false)
                    reset()
                },
                onError: (error) => {
                    toast.error("Erro ao criar")
                }
            })
        }
    }

    return {
        handleSubmit,
        isPending: createMutation.isPending || updateMutation.isPending,
    }
}