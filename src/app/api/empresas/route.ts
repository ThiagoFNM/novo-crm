import { NextResponse } from "next/server";
import db from "@/db"
import { empresas, usuariosInPortal } from "@/db/schema";
import { and, eq, ilike, sql, asc, desc, or, gt, lt, ne, notIlike, isNull, isNotNull, between, notBetween } from "drizzle-orm";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 10
    const sort = searchParams.get('sort') || "criadoEm"
    const order = searchParams.get('order') || "desc"

    const filterParams = searchParams.getAll('filter');
    const filtersByColumn: Record<string, { cond: string, val: string }[]> = {};

    filterParams.forEach(param => {
        const [col, cond, ...valParts] = param.split(':');
        const val = valParts.join(':'); // Handle cases where value might contain colons
        if (col && cond) {
            if (!filtersByColumn[col]) filtersByColumn[col] = [];
            filtersByColumn[col].push({ cond, val });
        }
    });

    const conditions = [];
    const cnpjConcatenated = sql`${empresas.cnpjBasico} || ${empresas.cnpjOrdem} || ${empresas.cnpjDv}`;

    for (const [colName, activeFilters] of Object.entries(filtersByColumn)) {
        if (colName === 'cnpj') {
            const cnpjConditions = activeFilters.map(f => {
                const normalized = f.val.replace(/\D/g, '');
                return ilike(cnpjConcatenated, `%${normalized}%`);
            });
            if (cnpjConditions.length > 0) conditions.push(or(...cnpjConditions));
            continue;
        }

        if (colName === 'cep') {
            const cepConditions = activeFilters.map(f => {
                const normalized = f.val.replace(/\D/g, '');
                return ilike(empresas.cep, `%${normalized}%`);
            });
            if (cepConditions.length > 0) conditions.push(or(...cepConditions));
            continue;
        }

        const column = (empresas as any)[colName];
        if (column) {
            const columnType = (column.columnType || "").toLowerCase();
            const isNumeric = columnType.includes("int") || columnType.includes("serial") || columnType.includes("numeric") || columnType.includes("double") || columnType.includes("real") || columnType.includes("decimal");
            const isBoolean = columnType.includes("bool");
            const isDate = columnType.includes("date") || columnType.includes("timestamp");

            const colConditions: any[] = [];

            activeFilters.forEach(f => {
                const { cond, val } = f;

                if (cond === 'vazio') {
                    colConditions.push(isNull(column));
                    return;
                }
                if (cond === 'naoVazio') {
                    colConditions.push(isNotNull(column));
                    return;
                }

                if (isBoolean) {
                    colConditions.push(eq(column, val === 'true'));
                    return;
                }

                if (isNumeric) {
                    if (cond === 'entre' || cond === 'naoEntre') {
                        const parts = val.split('|');
                        const start = Number(parts[0]);
                        const end = Number(parts[1]);
                        if (!isNaN(start) && !isNaN(end)) {
                            if (cond === 'entre') colConditions.push(between(column, start, end));
                            else colConditions.push(notBetween(column, start, end));
                        }
                    } else {
                        const num = Number(val);
                        if (!isNaN(num)) {
                            switch (cond) {
                                case 'maior': colConditions.push(gt(column, num)); break;
                                case 'menor': colConditions.push(lt(column, num)); break;
                                case 'diferente': colConditions.push(ne(column, num)); break;
                                default: colConditions.push(eq(column, num)); break;
                            }
                        }
                    }
                    return;
                }

                if (isDate) {
                    if (cond === 'entre' || cond === 'naoEntre') {
                        const parts = val.split('|');
                        const start = new Date(parts[0]);
                        const end = new Date(parts[1]);
                        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                            if (cond === 'entre') colConditions.push(between(column, start, end));
                            else colConditions.push(notBetween(column, start, end));
                        }
                    } else {
                        const dateVal = new Date(val);
                        if (!isNaN(dateVal.getTime())) {
                            switch (cond) {
                                case 'maior': colConditions.push(gt(column, dateVal)); break;
                                case 'menor': colConditions.push(lt(column, dateVal)); break;
                                case 'diferente': colConditions.push(ne(column, dateVal)); break;
                                case 'igual': colConditions.push(eq(column, dateVal)); break;
                            }
                        }
                    }
                    return;
                }

                // Default: Text
                switch (cond) {
                    case 'igual': colConditions.push(eq(column, val)); break;
                    case 'diferente': colConditions.push(ne(column, val)); break;
                    case 'comecaCom': colConditions.push(ilike(column, `${val}%`)); break;
                    case 'terminaCom': colConditions.push(ilike(column, `%${val}`)); break;
                    case 'contem': colConditions.push(ilike(column, `%${val}%`)); break;
                    case 'naoContem': colConditions.push(notIlike(column, `%${val}%`)); break;
                    default: colConditions.push(ilike(column, `%${val}%`)); break;
                }
            });

            if (colConditions.length > 0) {
                conditions.push(or(...colConditions));
            }
        }
    }

    // Determina a coluna e a direção da ordenação
    const validColumn = (empresas as any)[sort] || empresas.criadoEm;
    const orderDirection = order === 'asc' ? asc(validColumn) : desc(validColumn);

    const result = await db.select({
        id: empresas.id,
        razaoSocial: empresas.razaoSocial,
        cnpj: cnpjConcatenated,
        dsAtividadeEconomicaPrincipal: empresas.dsAtividadeEconomicaPrincipal,
        vertical: empresas.vertical,
        posse: empresas.posse,
        trilha: empresas.trilha,
        dominioPublico: empresas.dominioPublico,
        cep: empresas.cep,
        numeroEndereco: empresas.numeroEndereco,
        criadoEm: empresas.criadoEm,
        atualizadoEm: empresas.atualizadoEm,
        idHubSpot: empresas.idHubSpot,
        parqueProduto: empresas.parqueProduto,
        idStatus: empresas.idStatus,
        status: empresas.status,
        statusRelacionamento: empresas.statusRelacionamento,
        dtUltimaInteracao: empresas.dtUltimaInteracao,
        idProprietario: empresas.idProprietario,
    }).from(empresas)
        .leftJoin(usuariosInPortal, eq(usuariosInPortal.id, empresas.idProprietario))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(orderDirection)
        .limit(limit).offset((page - 1) * limit)

    const total = await db.select({ count: sql`count(*)` }).from(empresas)
        .where(conditions.length > 0 ? and(...conditions) : undefined)

    return NextResponse.json({ empresas: result, total: Number(total[0].count) })
}