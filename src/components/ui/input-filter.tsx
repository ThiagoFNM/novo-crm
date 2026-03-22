import { Input } from "./input";
import { useState, useEffect } from "react";
import { Filter } from "../table/controller";
import HistoricTextFilter from "./historic-text-filter";
import ConditionsInputFilter from "./conditions-input-filter";
import { FilterValue } from "./filters";
import { cn } from "@/lib/utils";
import { ComboboxMultiple } from "./combobox-multiple";


export default function InputFilter({ filter, filterValues, setFilterValues }: { filter: Filter, filterValues: FilterValue[], setFilterValues: React.Dispatch<React.SetStateAction<FilterValue[]>> }) {
    // Centralizando o estilo para facilitar manutenção. 
    // Fundo zinc-950 faz o input "afundar" em relação ao dropdown que é zinc-900.
    const baseInputStyles =`
        w-full h-8 px-2.5 bg-zinc-100 border border-violet-500/50 mt-0.5
        rounded-md text-xs text-zinc-950 placeholder:text-zinc-500 
        focus:outline-none focus:ring-2! focus:ring-violet-500/30! focus:border-violet-500!
        transition-all! text-xs!
    `;

    const { type } = filter

    const [inputValue, setInputValue] = useState<string>('')
    const [condition, setCondition] = useState<string>("contem")

    // Synchronize local condition with existing filter if applicable
    useEffect(() => {
        if (filterValues.length > 0 && filterValues[0].condition) {
            setCondition(filterValues[0].condition)
        }
    }, [filterValues])

    const handleConditionChange = (newCondition: string) => {
        setCondition(newCondition)
        // For number and date, we want to update the existing filter immediately if it exists
        if (type === "number" || type === "date") {
            setFilterValues(prev => {
                if (prev.length === 0) return prev
                const updated = [...prev]
                updated[0] = { ...updated[0], condition: newCondition }
                return updated
            })
        }
    }

    const onSubmitTextFilter = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        const value = inputValue.trim()
        if (!value) return

        setFilterValues(prev => {
            if (prev.some(f => f.value === value && f.condition === condition)) return prev

            return [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    name: filter.id,
                    value,
                    condition
                }
            ]

        })

        setInputValue("")
    }

    return (
        <form className="flex flex-col gap-2 w-full" onSubmit={onSubmitTextFilter}>
            {/* Texto */}
            {type === "text" && (
                <>
                    <ConditionsInputFilter 
                        type="text" 
                        filterValues={[{ id: 'temp', name: filter.id, value: '', condition }]} 
                        setFilterValues={(updater: any) => {
                            const next = typeof updater === 'function' ? updater([{ condition }]) : updater
                            handleConditionChange(next[0].condition)
                        }} 
                    />
                    <Input
                        type="text"
                        placeholder="Filtrar..."
                        className={cn(baseInputStyles )}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />

                    <HistoricTextFilter filtersValues={filterValues} setInputValues={setFilterValues} />
                </>

            )}

            {/* Número */}
            {type === "number" && (
                <>
                    <ConditionsInputFilter 
                        type="number" 
                        filterValues={[{ id: 'temp', name: filter.id, value: '', condition }]} 
                        setFilterValues={(updater: any) => {
                            const next = typeof updater === 'function' ? updater([{ condition }]) : updater
                            handleConditionChange(next[0].condition)
                        }} 
                    />
                    <div className="flex flex-col gap-2">
                        { (condition === "entre" || condition === "naoEntre") ? (
                            <div className="flex gap-2 items-center">
                                <Input
                                    type="number"
                                    placeholder="De"
                                    className={baseInputStyles}
                                    value={filterValues[0]?.value?.split('|')[0] || ""}
                                    onChange={(e) => {
                                        const val1 = e.target.value
                                        const val2 = filterValues[0]?.value?.split('|')[1] || ""
                                        const finalVal = `${val1}|${val2}`
                                        setFilterValues(prev => {
                                            const updated = [...prev]
                                            if (updated.length === 0) {
                                                updated.push({ id: crypto.randomUUID(), name: filter.id, value: finalVal, condition })
                                            } else {
                                                updated[0] = { ...updated[0], value: finalVal }
                                            }
                                            return updated
                                        })
                                    }}
                                />
                                <span className="text-zinc-500">-</span>
                                <Input
                                    type="number"
                                    placeholder="Até"
                                    className={baseInputStyles}
                                    value={filterValues[0]?.value?.split('|')[1] || ""}
                                    onChange={(e) => {
                                        const val1 = filterValues[0]?.value?.split('|')[0] || ""
                                        const val2 = e.target.value
                                        const finalVal = `${val1}|${val2}`
                                        setFilterValues(prev => {
                                            const updated = [...prev]
                                            if (updated.length === 0) {
                                                updated.push({ id: crypto.randomUUID(), name: filter.id, value: finalVal, condition })
                                            } else {
                                                updated[0] = { ...updated[0], value: finalVal }
                                            }
                                            return updated
                                        })
                                    }}
                                />
                            </div>
                        ) : (
                            <Input
                                type="number"
                                placeholder="0"
                                className={baseInputStyles}
                                value={filterValues[0]?.value || ""}
                                onChange={(e) => {
                                    const val = e.target.value
                                    setFilterValues(prev => {
                                        const updated = [...prev]
                                        if (updated.length === 0) {
                                            updated.push({
                                                id: crypto.randomUUID(),
                                                name: filter.id,
                                                value: val,
                                                condition: condition
                                            })
                                        } else {
                                            updated[0] = { ...updated[0], value: val }
                                        }
                                        return updated
                                    })
                                }}
                            />
                        )}
                    </div>
                </>
            )}

            {/* Data */}
            {type === "date" && (
                <>
                    <ConditionsInputFilter 
                        type="date" 
                        filterValues={[{ id: 'temp', name: filter.id, value: '', condition }]} 
                        setFilterValues={(updater: any) => {
                            const next = typeof updater === 'function' ? updater([{ condition }]) : updater
                            handleConditionChange(next[0].condition)
                        }} 
                    />
                    <div className="flex flex-col gap-2">
                        { (condition === "entre" || condition === "naoEntre") ? (
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-zinc-500 w-6">De:</span>
                                    <Input
                                        type="date"
                                        className={`${baseInputStyles} [&::-webkit-calendar-picker-indicator]:invert-[0.8]`}
                                        value={filterValues[0]?.value?.split('|')[0] || ""}
                                        onChange={(e) => {
                                            const val1 = e.target.value
                                            const val2 = filterValues[0]?.value?.split('|')[1] || ""
                                            const finalVal = `${val1}|${val2}`
                                            setFilterValues(prev => {
                                                const updated = [...prev]
                                                if (updated.length === 0) {
                                                    updated.push({ id: crypto.randomUUID(), name: filter.id, value: finalVal, condition })
                                                } else {
                                                    updated[0] = { ...updated[0], value: finalVal }
                                                }
                                                return updated
                                            })
                                        }}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-zinc-500 w-6">Até:</span>
                                    <Input
                                        type="date"
                                        className={`${baseInputStyles} [&::-webkit-calendar-picker-indicator]:invert-[0.8]`}
                                        value={filterValues[0]?.value?.split('|')[1] || ""}
                                        onChange={(e) => {
                                            const val1 = filterValues[0]?.value?.split('|')[0] || ""
                                            const val2 = e.target.value
                                            const finalVal = `${val1}|${val2}`
                                            setFilterValues(prev => {
                                                const updated = [...prev]
                                                if (updated.length === 0) {
                                                    updated.push({ id: crypto.randomUUID(), name: filter.id, value: finalVal, condition })
                                                } else {
                                                    updated[0] = { ...updated[0], value: finalVal }
                                                }
                                                return updated
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <Input
                                type="date"
                                className={`${baseInputStyles} [&::-webkit-calendar-picker-indicator]:invert-[0.8]`}
                                value={filterValues[0]?.value || ""}
                                onChange={(e) => {
                                    const val = e.target.value
                                    setFilterValues(prev => {
                                        const updated = [...prev]
                                        if (updated.length === 0) {
                                            updated.push({
                                                id: crypto.randomUUID(),
                                                name: filter.id,
                                                value: val,
                                                condition: condition
                                            })
                                        } else {
                                            updated[0] = { ...updated[0], value: val }
                                        }
                                        return updated
                                    })
                                }}
                            />
                        )}
                    </div>
                </>
            )}

            {/* Checkbox (Booleano) */}
            {type === "boolean" && (
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 hover:text-zinc-100 transition-colors py-1">
                    <Input
                        type="checkbox"
                        // Checkboxes não usam a mesma estilização de inputs de texto
                        className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-violet-500 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900 accent-violet-500 cursor-pointer"
                    />
                    <span>Ativo</span>
                </label>
            )}

            {/* Select (Lista de opções) */}
            {type === "multiple" && (
                <ComboboxMultiple />
            )}
        </form>
    );
}