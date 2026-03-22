import { NextResponse } from "next/server";
import { PipelinesRepository } from "@/app/infra/database/pipelines/pipelinesRepository";

const pipelinesRepository = new PipelinesRepository()

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (id) {
        const pipeline = await pipelinesRepository.getPipelineById(Number(id))
        return NextResponse.json(pipeline)
    }

    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 10
    const sort = searchParams.get('sort') || "criadoEm"
    const order = searchParams.get('order') || "desc"

    const filters = searchParams.getAll('filter')

    const pipelines = await pipelinesRepository.getPipelines(page, limit, sort, order, filters)
    return NextResponse.json(pipelines)
}

export async function POST(request: Request) {
    const body = await request.json()
    const pipeline = await pipelinesRepository.createPipeline(body)
    return NextResponse.json(pipeline)
}

export async function PUT(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const data = await request.json();
    return Response.json(await pipelinesRepository.updatePipeline(Number(id), data));
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    return Response.json(await pipelinesRepository.deletePipeline(Number(id)));
}