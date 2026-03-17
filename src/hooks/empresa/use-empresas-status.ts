import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { getEmpresaStatus } from "@/service/empresa/empresaStatus"
import { Filter } from "@/components/table/controller"

export function useEmpresasStatus(filters: Filter[] = []) {
    return useQuery({
        queryKey: ["empresas-status", filters],
        queryFn: () => getEmpresaStatus(filters),
        placeholderData: keepPreviousData,
    })
}