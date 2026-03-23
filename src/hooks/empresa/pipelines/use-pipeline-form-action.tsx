import { UpdatePipelineData } from "@/app/infra/database/pipelines/pipelinesRepository"
import { toast } from "sonner"
import z from "zod"
import { usePipelines } from "./use-pipelines"

export function getChanges(oldData: UpdatePipelineData = {}, newData: UpdatePipelineData) {
    const changes: UpdatePipelineData = {}
    if (oldData.nome !== newData.nome) {
        changes.nome = newData.nome
    }
    if (oldData.entidade !== newData.entidade) {
        changes.entidade = newData.entidade
    }
    if (oldData.ativo !== newData.ativo) {
        changes.ativo = newData.ativo
    }
    return changes
}

const pipelineSchema = z.object({
    nome: z.string().nonempty("Nome do status é obrigatório"),
    entidade: z.string().nonempty("Entidade é obrigatória"),
    config: z.any().optional(),
    ativo: z.boolean().optional(),
})
export function usePipelineFormAction({ pipeline, editMode, setOpen }: { pipeline?: UpdatePipelineData & { id?: number }, editMode: boolean, setOpen: (open: boolean) => void }) {
    const { createMutation, updateMutation } = usePipelines()

    const handleSubmit = ({
        data,
        reset,
        setErrors
    }: {
        data: UpdatePipelineData,
        reset: () => void,
        setErrors: (errors: Record<string, string>) => void
    }) => {

        const changes = getChanges(pipeline || {}, data)
        const hasChanges = Object.keys(changes).length > 0

        if (editMode && !hasChanges) {
            toast.info("Nenhuma alteração foi feita")
            return
        }

        const result = pipelineSchema.safeParse(data)

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

        if (editMode && pipeline?.id) {
            updateMutation.mutate(
                { id: pipeline.id, data: changes },
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
            createMutation.mutate(data as any as import("@/app/infra/database/pipelines/pipelinesRepository").CreatePipelineData, {
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