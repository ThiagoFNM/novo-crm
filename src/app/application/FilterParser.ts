import {
  between,
  eq,
  gt,
  ilike,
  isNotNull,
  isNull,
  lt,
  ne,
  notBetween,
  notIlike,
  or
} from "drizzle-orm"

type ColumnConfig = {
  column: any
  type: "text" | "number" | "boolean" | "date"
  transform?: (val: string) => any
}

export class FilterParser {

  parse(
    filterParams: string[],
    columnMap: Record<string, ColumnConfig>
  ) {

    const filtersByColumn: Record<string, { cond: string, val: string }[]> = {}

    filterParams.forEach(param => {
      const [col, cond, ...valParts] = param.split(':')
      const val = valParts.join(':')

      if (col && cond) {
        if (!filtersByColumn[col]) filtersByColumn[col] = []
        filtersByColumn[col].push({ cond, val })
      }
    })

    const conditions: any[] = []

    for (const [colName, activeFilters] of Object.entries(filtersByColumn)) {

      const config = columnMap[colName]
      if (!config) continue

      const column = config.column
      const colConditions: any[] = []

      activeFilters.forEach(f => {

        let value = f.val

        if (config.transform) {
          value = config.transform(value)
        }

        if (f.cond === "vazio") {
          colConditions.push(isNull(column))
          return
        }

        if (f.cond === "naoVazio") {
          colConditions.push(isNotNull(column))
          return
        }

        switch (config.type) {

          case "boolean":
            colConditions.push(eq(column, value === "true"))
            break

          case "number":

            if (f.cond === "entre" || f.cond === "naoEntre") {

              const [start, end] = value.split("|").map(Number)

              if (f.cond === "entre")
                colConditions.push(between(column, start, end))
              else
                colConditions.push(notBetween(column, start, end))

            } else {

              const num = Number(value)

              switch (f.cond) {
                case "maior": colConditions.push(gt(column, num)); break
                case "menor": colConditions.push(lt(column, num)); break
                case "diferente": colConditions.push(ne(column, num)); break
                default: colConditions.push(eq(column, num))
              }

            }

            break

          case "date":

            if (f.cond === "entre" || f.cond === "naoEntre") {

              const [startStr, endStr] = value.split("|")
              const start = new Date(startStr)
              const end = new Date(endStr)

              if (f.cond === "entre")
                colConditions.push(between(column, start, end))
              else
                colConditions.push(notBetween(column, start, end))

            } else {

              const dateVal = new Date(value)

              switch (f.cond) {
                case "maior": colConditions.push(gt(column, dateVal)); break
                case "menor": colConditions.push(lt(column, dateVal)); break
                case "igual": colConditions.push(eq(column, dateVal)); break
              }
            }

            break

          default:

            switch (f.cond) {
              case "igual": colConditions.push(eq(column, value)); break
              case "diferente": colConditions.push(ne(column, value)); break
              case "comecaCom": colConditions.push(ilike(column, `${value}%`)); break
              case "terminaCom": colConditions.push(ilike(column, `%${value}`)); break
              case "contem": colConditions.push(ilike(column, `%${value}%`)); break
              case "naoContem": colConditions.push(notIlike(column, `%${value}%`)); break
              default: colConditions.push(ilike(column, `%${value}%`))
            }

        }

      })

      if (colConditions.length > 0) {
        conditions.push(or(...colConditions))
      }

    }

    return conditions
  }

}