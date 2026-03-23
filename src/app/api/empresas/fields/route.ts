import { EmpresaFieldsRepository } from "@/app/infra/database/empresas/empresaFieldsRepository";
import { NextResponse } from "next/server";

const empresaFieldsRepository = new EmpresaFieldsRepository();

export async function GET() {
    try {
        const fields = await empresaFieldsRepository.getFields();
        return NextResponse.json(fields);
    } catch (error) {
        console.error("Error fetching fields:", error);
        return NextResponse.json({ error: "Failed to fetch fields" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const data = await request.json();
    console.log(id, data);
    return Response.json(await empresaFieldsRepository.updateField(String(id), data));
}