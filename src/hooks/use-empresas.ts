import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
} from '@tanstack/react-query'
import { getEmpresas } from '@/service/empresas'

export function useEmpresas(page: number, limit: number) {
    return useQuery({
        queryKey: ['empresas', page, limit],
        queryFn: () => getEmpresas(page, limit),
        placeholderData: keepPreviousData,
    })
}
