import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import React from "react"

import { cn } from "@/lib/utils"

export function ComboboxMultiple({
  options = [],
  value = [],
  onChange,
  placeholder = "Selecionar...",
  isLoading = false,
  className
}: {
  options: { label: string; value: string }[]
  value: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  isLoading?: boolean
  className?: string
}) {
  const anchor = useComboboxAnchor()

  const itemsPrimitive = options.map(opt => opt.value);

  return (
    <Combobox
      multiple
      autoHighlight
      items={itemsPrimitive}
      value={value}
      onValueChange={(val: any) => {
        onChange(val)
      }}
    >
      <ComboboxChips ref={anchor} className={cn("w-full h-auto min-h-8 px-2.5 bg-zinc-100 border border-violet-500/50 mt-0.5 rounded-md focus-within:ring-2 focus-within:ring-violet-500/30 focus-within:border-violet-500 transition-all text-xs", className)}>
        <ComboboxValue>
          {(selectedValues: any) => {
            const vals = Array.isArray(selectedValues) ? selectedValues : [];
            return (
            <React.Fragment>
              {vals.map((v) => {
                const label = options.find(o => o.value === v)?.label || v;
                return (
                  <ComboboxChip key={v} className="bg-violet-500/20 text-violet-700 h-5 px-1.5 text-[10px] sm:text-xs my-0.5" showRemove={true}>
                    {label}
                  </ComboboxChip>
                )
              })}
              <ComboboxChipsInput placeholder={vals.length === 0 ? placeholder : ""} className="text-zinc-950 placeholder:text-zinc-500 text-xs min-w-[60px]" />
            </React.Fragment>
          )}}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor} align="start" className="w-full bg-zinc-100 border-border text-zinc-950 p-2 shadow-xl z-50">
        <ComboboxEmpty className="py-2 text-xs">{isLoading ? "Carregando..." : "Nenhum resultado."}</ComboboxEmpty>
        <ComboboxList className="max-h-48 overflow-y-auto">
          {(item: any) => {
            const label = options.find(o => o.value === item)?.label || item;
            return (
              <ComboboxItem key={item} value={item} className="cursor-pointer text-xs text-zinc-950 hover:bg-violet-500/20 data-highlighted:bg-violet-500/20 data-highlighted:text-violet-700 transition-colors my-1 rounded-sm px-2 py-1.5 flex justify-between">
                {label}
              </ComboboxItem>
            )
          }}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}