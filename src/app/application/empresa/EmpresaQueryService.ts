import { asc, desc, sql } from "drizzle-orm";
import { empresas } from "../../infra/database/db/schema";
import { EmpresaRepository } from "../../infra/database/empresas/empresaRepository";
import { FilterParser } from "../FilterParser";


export class EmpresaQueryService {

    private columnMap = {
        razaoSocial: { column: empresas.razaoSocial, type: "text" as const },
        cnpj: { 
            column: sql`CONCAT(${empresas.cnpjBasico}, ${empresas.cnpjOrdem}, ${empresas.cnpjDv})`, 
            type: "text" as const,
            transform: (v: string) => v.replace(/\D/g, '')
        },
        dsAtividadeEconomicaPrincipal: { column: empresas.dsAtividadeEconomicaPrincipal, type: "text" as const },
        setor: { column: empresas.setor, type: "text" as const },
        posse: { column: empresas.posse, type: "text" as const },
        trilha: { column: empresas.trilha, type: "text" as const },
        dominioPublico: { column: empresas.dominioPublico, type: "boolean" as const },
        cep: { 
            column: empresas.cep, 
            type: "text" as const,
            transform: (v: string) => v.replace(/\D/g, '')
        },
        numeroEndereco: { column: empresas.numeroEndereco, type: "text" as const },
        criadoEm: { column: empresas.criadoEm, type: "date" as const },
        atualizadoEm: { column: empresas.atualizadoEm, type: "date" as const },
        idHubSpot: { column: empresas.idHubSpot, type: "number" as const },
        parqueProduto: { column: empresas.parqueProduto, type: "text" as const },
        idStatus: { column: empresas.idStatus, type: "number" as const },
        status: { column: empresas.status, type: "text" as const },
        statusRelacionamento: { column: empresas.statusRelacionamento, type: "text" as const },
        dtUltimaInteracao: { column: empresas.dtUltimaInteracao, type: "date" as const },
        idProprietario: { column: empresas.idProprietario, type: "number" as const }
    };
    
    constructor(
        private repository = new EmpresaRepository(),
        private filterParser = new FilterParser()
    ){}

    async listaEmpresas(params: { page: number, limit: number, filters: string[], sort?: string, order?: string }){
        const condition = this.filterParser.parse(params.filters, this.columnMap)

        const sortField = (empresas as any)[params.sort || 'criadoEm'] || empresas.criadoEm;
        const orderDirection = params.order === 'asc' ? asc(sortField) : desc(sortField);

        const [list, totalResult] = await Promise.all([
            this.repository.getMany(params.page, params.limit, condition, orderDirection),
            this.repository.count(condition)
        ])

        const total = Number((totalResult[0] as any)?.count || 0);

        return {list, total}
    }

}