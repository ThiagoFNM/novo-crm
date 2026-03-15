import { NextResponse } from "next/server";
import { EmpresaQueryService } from "@/app/application/empresa/EmpresaQueryService";

export async function GET(req: Request) {
    const {searchParams} = new URL(req.url)

    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 10
    const sort = searchParams.get('sort') || "criadoEm"
    const order = searchParams.get('order') || "desc"

    const filters = searchParams.getAll('filter')

    const empresaQueryService = new EmpresaQueryService()

    const {list, total} = await empresaQueryService.listaEmpresas({page, limit, filters, sort, order})

    return NextResponse.json({ empresas: list, total })
}