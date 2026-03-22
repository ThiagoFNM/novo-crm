import { X } from "lucide-react";
import { Button } from "./button";
import { FilterValue } from "./filters";

export default function HistoricTextFilter({
    filtersValues,
    setInputValues
    
}: {
    filtersValues: FilterValue[]
    setInputValues: React.Dispatch<React.SetStateAction<FilterValue[]>>
}) {

    function removeFilter(id: string) {
        setInputValues(prev => prev.filter((filter) => filter.id !== id))   
    }

    const conditionLabels: Record<string, string> = {
        maior: ">",
        menor: "<",
        igual: "=",
        diferente: "!=",
        contem: "Contém",
        naoContem: "Não contém",
        comecaCom: "Começa com",
        terminaCom: "Termina com",
        entre: "Entre",
        naoEntre: "Não entre",
        vazio: "Vazio",
        naoVazio: "Não vazio"
    }

    return (
        <div className="flex flex-col gap-1 ">
            {filtersValues.map((filter) => (
                <div key={filter.id} 
                className="flex items-center gap-2 text-xs text-zinc-800 font-semibold bg-zinc-100 p-2 rounded-md border-zinc-800 hover:bg-red-100   transition-colors duration-200"
                onClick={() => {
                 removeFilter(filter.id)  
                }}
                >
                    
                    <span className="font-mono text-violet-400">{filter.condition ? conditionLabels[filter.condition] : ''}:</span>
                    <span>
                        {filter.value.includes('|') ? (
                            <>
                                {filter.value.split('|')[0]} <span className="text-zinc-600">até</span> {filter.value.split('|')[1]}
                            </>
                        ) : (
                            filter.value
                        )}
                    </span>

                </div>
            ))}
        </div>
    )
}
