import { EmpresaStatusRepository } from "@/app/infra/database/empresas/empresaStatusRepository";

const empresaStatusRepository = new EmpresaStatusRepository();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const id = searchParams.get("id");
    const ativo = searchParams.get("ativo");

    if (status || id || ativo) {
        return Response.json(await empresaStatusRepository.getMany({status: status || undefined, id: id ? Number(id) : undefined, ativo: ativo ? Boolean(ativo) : undefined}));
    }

    return Response.json(await empresaStatusRepository.getMany());
}

export async function POST(request: Request) {
    const data = await request.json();
    return Response.json(await empresaStatusRepository.create(data));
}

export async function PUT(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const data = await request.json();
    return Response.json(await empresaStatusRepository.update(Number(id), data));
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    return Response.json(await empresaStatusRepository.delete(Number(id)));
}