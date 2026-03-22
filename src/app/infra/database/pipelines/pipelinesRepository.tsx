import db from "../db"
import { pipelines } from "../db/schema"
import { and, asc, desc, eq } from "drizzle-orm"


export type CreatePipelineData = {
    nome: string
    user_id?: number
    entidade: string
    config?: any
}

export type UpdatePipelineData = {
    nome?: string
    user_id?: number
    entidade?: string
    config?: any
    ativo?: boolean
}

export type Pipeline = {
    id: number
    nome: string
    user_id: number | null
    entidade: string
    config: any
    criadoEm: string | null
}

export class PipelinesRepository {
    async createPipeline(data: CreatePipelineData): Promise<Pipeline> {
        const insertData = { ...data, config: data.config ?? {} };
        const [pipeline] = await db.insert(pipelines).values(insertData).returning()
        return pipeline
    }

    async updatePipeline(id: number, data: UpdatePipelineData): Promise<Pipeline> {
        const updateData = { ...data };
        if (updateData.config === undefined) {
            const currentPipeline = await this.getPipelineById(id);
            if (currentPipeline) {
                updateData.config = currentPipeline.config;
            }
        }
        const [pipeline] = await db.update(pipelines).set(updateData).where(eq(pipelines.id, id)).returning()
        return pipeline
    }

    async deletePipeline(id: number): Promise<Pipeline> {
        const [pipeline] = await db.delete(pipelines).where(eq(pipelines.id, id)).returning()
        return pipeline
    }

    async getPipelineById(id: number): Promise<Pipeline> {
        const [pipeline] = await db.select().from(pipelines).where(eq(pipelines.id, id))
        return pipeline
    }

    async getPipelines(page: number, limit: number, sort: string, order: string, filters: any[] = []): Promise<Pipeline[]> {
        const orderDirection = order === "asc" ? asc(pipelines.criadoEm) : desc(pipelines.criadoEm)
        const pipelinesList = await db.select().from(pipelines)
            .where(filters.length > 0 ? and(...filters) : undefined)
            .orderBy(orderDirection)
            .limit(limit).offset((page - 1) * limit)
        return pipelinesList
    }
}