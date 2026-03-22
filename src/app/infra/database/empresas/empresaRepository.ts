import { empresas } from "@/app/infra/database/db/schema";
import { eq, sql, and } from "drizzle-orm";
import { usuariosInPortal } from "@/app/infra/database/db/schema";
import db  from "@/app/infra/database/db";

export class EmpresaRepository {
    
    async getMany(page: number, limit: number,conditions:any[], orderDirection:any) {
        const cnpjConcatenated = sql`CONCAT(${empresas.cnpjBasico}, ${empresas.cnpjOrdem}, ${empresas.cnpjDv})`;
        return await db.select({
        id: empresas.id,
        razaoSocial: empresas.razaoSocial,
        cnpj: cnpjConcatenated,
        dsAtividadeEconomicaPrincipal: empresas.dsAtividadeEconomicaPrincipal,
        setor: empresas.setor,
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
    }

    async count(conditions:any[]) {
        return await db.select({ count: sql`count(*)` }).from(empresas)
            .where(conditions.length > 0 ? and(...conditions) : undefined)
    }

    
}