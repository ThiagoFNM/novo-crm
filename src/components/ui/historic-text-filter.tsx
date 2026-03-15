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
        <div className="flex flex-col gap-1">
            {filtersValues.map((filter) => (
                <div key={filter.id} className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-950 p-1 px-2 rounded-md border border-zinc-800">
                    
                    <span className="font-mono text-violet-400">{filter.condition ? conditionLabels[filter.condition] : ''}</span>
                    <span>
                        {filter.value.includes('|') ? (
                            <>
                                {filter.value.split('|')[0]} <span className="text-zinc-600">até</span> {filter.value.split('|')[1]}
                            </>
                        ) : (
                            filter.value
                        )}
                    </span>

                    <Button type="button" variant="ghost" className="h-4 w-4 p-0 ml-auto hover:text-red-400" onClick={() => removeFilter(filter.id)}><X size={12} /></Button>
                </div>
            ))}
        </div>
    )
}