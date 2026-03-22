import { NextResponse } from "next/server";
import { EmpresasSetoresRepository } from "@/app/infra/database/empresas/empresaSetoresrepository";

const empresasSetoresRepository = new EmpresasSetoresRepository()

const searchParams = {
    
}

export async function GET() {
    const setores = await empresasSetoresRepository.getMany()
    return NextResponse.json(setores)
}

export async function POST(request: Request) {
    const { setor } = await request.json()
    const newSetor = await empresasSetoresRepository.create({ setor })
    return NextResponse.json(newSetor)
}

export async function PUT(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const data = await request.json();
    
    const updatedSetor = await empresasSetoresRepository.update(Number(id), data)
    return NextResponse.json(updatedSetor)
}

export async function DELETE(request: Request) {
    const { id } = await request.json()
    const deletedSetor = await empresasSetoresRepository.delete(id)
    return NextResponse.json(deletedSetor)
}