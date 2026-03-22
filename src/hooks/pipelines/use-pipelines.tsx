import { keepPreviousData, useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { getPipelines, createPipeline, deletePipeline, updatePipeline } from "@/service/pipelines/pipeline"
import { UpdatePipelineData } from "@/app/infra/database/pipelines/pipelinesRepository";

interface UsePipelinesOptions {
    page: number;
    limit: number;
    sort: string;
    order: string;
    filters?: any[];
}

export function usePipelines(options?: Partial<UsePipelinesOptions>) {
    const queryClient = useQueryClient()
    const { page = 1, limit = 10, sort = "criadoEm", order = "desc", filters = [] } = options || {}

    const query = useQuery({
        queryKey: ['pipelines', page, limit, sort, order, filters],
        queryFn: async () => {
            const res = await getPipelines(page, limit, sort, order, filters)
            return res.data
        },
        placeholderData: keepPreviousData,
    })

    const createMutation = useMutation({
        mutationFn: createPipeline,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pipelines"] })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deletePipeline,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pipelines"] })
        },
    })

    const updateMutation = useMutation({
        mutationFn: (variables: { id: number, data: UpdatePipelineData }) => updatePipeline(variables.id, variables.data),
        onSuccess: (_, variables) => {
            queryClient.setQueriesData({ queryKey: ["pipelines"] }, (oldData: any[]) => {
                if (!oldData) return oldData

                return oldData.map(item =>
                    item.id === variables.id
                        ? { ...item, ...variables.data }
                        : item
                )
            })

            queryClient.invalidateQueries({ queryKey: ["pipelines"] })
        },
    })

    return {
        query,
        createMutation,
        deleteMutation,
        updateMutation
    }
}

