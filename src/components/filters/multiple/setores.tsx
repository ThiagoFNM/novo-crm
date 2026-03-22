// Wrapper to handle dynamic fetch without polluting generic InputFilter logic
import { Filter } from "@/components/table/controller";
import { ComboboxMultiple } from "@/components/ui/combobox-multiple";
import { FilterValue } from "@/components/ui/filters";
import { useEmpresasSetores } from "@/hooks/setores/use-empresas-setores";

export default function SetoresMultipleFilter({ 
    filter, 
    filterValues, 
    setFilterValues, 
    condition 
}: { 
    filter: Filter, 
    filterValues: FilterValue[], 
    setFilterValues: React.Dispatch<React.SetStateAction<FilterValue[]>>,
    condition: string 
}) {
    const { query } = useEmpresasSetores();
    
    const dataArray = Array.isArray(query.data) ? query.data : query.data?.data;
    
    const options = [
        { label: "Vazio", value: "vazio" },
        ...(dataArray || [])
            .filter((setor: any) => setor.ativo !== false) // Assegurando de filtrar ativos
            .map((setor: any) => ({
                label: setor.setor,
                
                //Alterar para envio ao backend para query, esse campo é responsalvel por passar valor do filtro para URL
                value: setor.setor
            }))
    ];

    const selectedValues = filterValues.map(f => f.condition === "vazio" ? "vazio" : String(f.value));

    return (
        <ComboboxMultiple
            options={options} 
            value={selectedValues} 
            isLoading={query.isLoading}
            onChange={(newValues) => {
                setFilterValues(prev => {
                    const newValuesObjects = newValues.map(val => ({
                        id: crypto.randomUUID(),
                        name: filter.id,
                        value: val === "vazio" ? "" : val,
                        condition: val === "vazio" ? "vazio" : (condition || "igual")
                    }));
                    return newValuesObjects;
                });
            }} 
            placeholder="Selecione os setores..."
        />
    )
}