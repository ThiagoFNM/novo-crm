import { NextResponse } from "next/server";
import db from "@/db"
import { empresas, usuariosInPortal } from "@/db/schema";
import { eq, ilike, sql, asc, desc } from "drizzle-orm";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 10
    const sort = searchParams.get('sort') || "criadoEm"
    const order = searchParams.get('order') || "desc"

    const filters = {
        razaoSocial: searchParams.get('razaoSocial') || "",
        cnpj: searchParams.get('cnpj') || "",
        dsAtividadeEconomicaPrincipal: searchParams.get('dsAtividadeEconomicaPrincipal') || "",
        vertical: searchParams.get('vertical') || "",
        posse: searchParams.get('posse') || "",
        trilha: searchParams.get('trilha') || "",
        dominioPublico: searchParams.get('dominioPublico') || "",
        cep: searchParams.get('cep') || "",
        numeroEndereco: searchParams.get('numeroEndereco') || "",
        criadoEm: searchParams.get('criadoEm') || "",
        atualizadoEm: searchParams.get('atualizadoEm') || "",
        idHubSpot: searchParams.get('idHubSpot') || "",
        parqueProduto: searchParams.get('parqueProduto') || "",
        idStatus: searchParams.get('idStatus') || "",
        status: searchParams.get('status') || "",
        statusRelacionamento: searchParams.get('statusRelacionamento') || "",
        dtUltimaInteracao: searchParams.get('dtUltimaInteracao') || "",
        idProprietario: searchParams.get('idProprietario') || "",
    }

    // Determina a coluna e a direção da ordenação
    const validColumn = (empresas as any)[sort] || empresas.criadoEm;
    const orderDirection = order === 'asc' ? asc(validColumn) : desc(validColumn);

    const result = await db.select({
        id: empresas.id,
        razaoSocial: empresas.razaoSocial,
        cnpj: sql`${empresas.cnpjBasico} || ${empresas.cnpjOrdem} || ${empresas.cnpjDv}`,
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
    .where(filters.razaoSocial ? ilike(empresas.razaoSocial, `%${filters.razaoSocial}%`) : undefined)
    .orderBy(orderDirection)
    .limit(limit).offset((page - 1) * limit)
    
    const total = await db.select({ count: sql`count(*)` }).from(empresas)
    .where(filters.razaoSocial ? ilike(empresas.razaoSocial, `%${filters.razaoSocial}%`) : undefined)

    return NextResponse.json({ empresas: result, total: Number(total[0].count) })
}