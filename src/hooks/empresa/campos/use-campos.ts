import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query"
import { getFields, updateField, UpdateCamposDataTypes, createField } from "@/service/empresa/empresaCampos"

export function useEmpresasCampos() {
    const query = useQuery({
        queryKey: ["empresas-campos"],
        queryFn: async () => {
            const res = await getFields()
            return res
        },
        placeholderData: keepPreviousData,
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: UpdateCamposDataTypes }) => updateField(id, data),
        onSuccess: () => {
            query.refetch()
        }
    })

    const createMutation = useMutation({
        mutationFn: (data: UpdateCamposDataTypes) => createField(data),
        onSuccess: () => {
            query.refetch()
        }
    })
    return { query, updateMutation, createMutation }
}