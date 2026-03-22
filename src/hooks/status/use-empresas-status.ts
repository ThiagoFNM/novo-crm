import { useQuery, keepPreviousData, useMutation, useQueryClient } from "@tanstack/react-query"
import { getEmpresaStatus, createEmpresaStatus, deleteEmpresaStatus, updateEmpresaStatus, UpdateEmpresaStatusDatTypes } from "@/service/empresa/empresaStatus"
import { Filter } from "@/components/table/controller"
import { toast } from "sonner"
import z from "zod"

export function useEmpresasStatus(filters: Filter[] = []) {
    const queryClient = useQueryClient()
    const refreshCache = () => queryClient.setQueryData(["empresas-status", filters], (oldData: any) => {
        if (!oldData) return []
        return oldData
    })

    const query = useQuery({
        queryKey: ["empresas-status", filters],
        queryFn: async () => {
            const res = await getEmpresaStatus(filters)
            return res.data
        },
        placeholderData: keepPreviousData,
    })

    const createMutation = useMutation({
        mutationFn: createEmpresaStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["empresas-status"] })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deleteEmpresaStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["empresas-status"] })
        },
    })


    const updateMutation = useMutation({
        mutationFn: (variables: { id: number, data: UpdateEmpresaStatusDatTypes }) => updateEmpresaStatus(variables.id, variables.data),
        onSuccess: (_, variables) => {
            queryClient.setQueriesData({ queryKey: ["empresas-status"] }, (oldData: any[]) => {
                if (!oldData) return oldData

                return oldData.map(item =>
                    item.id === variables.id
                        ? { ...item, ...variables.data }
                        : item
                )
            })

            queryClient.invalidateQueries({ queryKey: ["empresas-status"] })
        },

    })

    return {
        query,
        createMutation,
        deleteMutation,
        updateMutation
    }
}

export function getChanges(oldData: UpdateEmpresaStatusDatTypes = {}, newData: UpdateEmpresaStatusDatTypes) {
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

const statusSchema = z.object({
    status: z.string().nonempty("Nome do status é obrigatório"),
    cor: z.string().nonempty("Cor é obrigatória"),
    ativo: z.boolean().optional(),
})
export function useStatusFormAction({ status, editMode, setOpen }: { status?: UpdateEmpresaStatusDatTypes & { id?: number }, editMode: boolean, setOpen: (open: boolean) => void }) {
    const { createMutation, updateMutation } = useEmpresasStatus()

    const handleSubmit = ({
        data,
        reset,
        setErrors
    }: {
        data: UpdateEmpresaStatusDatTypes,
        reset: () => void,
        setErrors: (errors: Record<string, string>) => void
    }) => {

        const changes = getChanges(status || {}, data)
        const hasChanges = Object.keys(changes).length > 0

        if (editMode && !hasChanges) {
            toast.info("Nenhuma alteração foi feita")
            return
        }

        const result = statusSchema.safeParse(data)

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

        if (editMode && status?.id) {
            updateMutation.mutate(
                { id: status.id, data: changes },
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