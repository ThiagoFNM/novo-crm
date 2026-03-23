import {
  useQuery,
  keepPreviousData,
} from '@tanstack/react-query'
import { getEmpresas } from '@/service/empresa/empresa'
import { Filter } from '@/components/table/controller'

export function useEmpresas(page: number, limit: number, sort: string, order: string, filters: Filter[] = []) {

    const queryEmpresas = useQuery({
        queryKey: ['empresas', page, limit, sort, order, filters],
        queryFn: () => getEmpresas(page, limit, sort, order, filters),
        placeholderData: keepPreviousData,
    })

    return { queryEmpresas }
}


