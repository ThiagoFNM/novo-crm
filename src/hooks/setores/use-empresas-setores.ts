import { useQuery, keepPreviousData, useMutation, useQueryClient } from "@tanstack/react-query"
import { getEmpresaSetores, createEmpresaSetor, deleteEmpresaSetor, updateEmpresaSetor, UpdateEmpresaSetorDatTypes } from "@/service/empresa/empresaSetor"
import { Filter } from "@/components/table/controller"


export function useEmpresasSetores(filters: Filter[] = []) {
    const queryClient = useQueryClient()
    const refreshCache = () => queryClient.setQueryData(["empresas-setores", filters], (oldData: any) => {
        if (!oldData) return []
        return oldData
    })

    const query = useQuery({
        queryKey: ["empresas-setores", filters],
        queryFn: async () => {
            const res = await getEmpresaSetores(filters)
            return res.data
        },
        placeholderData: keepPreviousData,
    })

    const createMutation = useMutation({
        mutationFn: createEmpresaSetor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["empresas-setores"] })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deleteEmpresaSetor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["empresas-setores"] })
        },
    })


    const updateMutation = useMutation({
        mutationFn: (variables: { id: number, data: UpdateEmpresaSetorDatTypes }) => updateEmpresaSetor(variables.id, variables.data),
        onSuccess: (_, variables) => {
            queryClient.setQueriesData({ queryKey: ["empresas-setores"] }, (oldData: any[]) => {
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

