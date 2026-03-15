import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./select"
import { FilterValue } from "./filters"

export default function ConditionsInputFilter({
    filterValues,
    setFilterValues,
    type
}: {
    filterValues: FilterValue[]
    setFilterValues: React.Dispatch<React.SetStateAction<FilterValue[]>>
    type: "text" | "number" | "date"
}) {

    const condition = filterValues[0]?.condition ?? "igual"

    const options = [
        { value: "igual", label: "Igual a", types: ["text", "number", "date"] },
        { value: "diferente", label: "Diferente de", types: ["text", "number", "date"] },
        { value: "maior", label: "Maior que", types: ["number", "date"] },
        { value: "menor", label: "Menor que", types: ["number", "date"] },
        { value: "contem", label: "Contém", types: ["text"] },
        { value: "naoContem", label: "Não contém", types: ["text"] },
        { value: "comecaCom", label: "Começa com", types: ["text"] },
        { value: "terminaCom", label: "Termina com", types: ["text"] },
        { value: "entre", label: "Entre", types: ["number", "date"] },
        { value: "naoEntre", label: "Não entre", types: ["number", "date"] },
        { value: "vazio", label: "Vazio", types: ["text", "number", "date"] },
        { value: "naoVazio", label: "Não vazio", types: ["text", "number", "date"] },
    ].filter(opt => opt.types.includes(type))

    function handleChange(value: string) {
        setFilterValues(prev => {
            if (prev.length === 0) return prev

            const updated = [...prev]
            updated[0] = {
                ...updated[0],
                condition: value
            }

            return updated
        })
    }

    return (
        <Select value={condition} onValueChange={handleChange}>
            <SelectTrigger className="w-full h-8 px-2.5 bg-zinc-950 border border-zinc-800 
                rounded-md text-xs text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                
                <SelectValue placeholder="Condição" />

            </SelectTrigger>

            <SelectContent className="bottom-0 top-10 bg-zinc-900 border border-zinc-800 rounded-md shadow-xl shadow-black/50 p-3 animate-in fade-in zoom-in-95 duration-200 text-zinc-200 text-xs">
                {options.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}