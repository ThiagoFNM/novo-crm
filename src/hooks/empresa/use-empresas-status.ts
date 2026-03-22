import { useQuery, keepPreviousData, useMutation, useQueryClient } from "@tanstack/react-query"
import { getEmpresaStatus, createEmpresaStatus, deleteEmpresaStatus, updateEmpresaStatus, UpdateEmpresaStatusDatTypes } from "@/service/empresa/empresaStatus"
import { Filter } from "@/components/table/controller"

export function useEmpresasStatus(filters: Filter[] = []) {
    const queryClient = useQueryClient()

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
        mutationFn: (data: { id: number, data: UpdateEmpresaStatusDatTypes }) => updateEmpresaStatus(data.id, data.data),
        onSuccess: () => {
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