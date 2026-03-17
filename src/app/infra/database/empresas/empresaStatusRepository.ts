import { and, eq } from "drizzle-orm";
import db from "../db";
import { statusEmpresas } from "../db/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

type StatusEmpresasInsert = InferInsertModel<typeof statusEmpresas>
type StatusEmpresasSelect = InferSelectModel<typeof statusEmpresas>

export class EmpresaStatusRepository {

    private baseSelect = {
        id: statusEmpresas.id,
        status: statusEmpresas.status,
        cor: statusEmpresas.cor,
        ativo: statusEmpresas.ativo
    }

    async getMany(filters?: {ativo?:boolean, id?:number, status?:string}) {
        const conditions = []
        if(filters?.ativo !== undefined){
            conditions.push(eq(statusEmpresas.ativo, filters.ativo))
        }
        if(filters?.id !== undefined){
            conditions.push(eq(statusEmpresas.id, filters.id))
        }
        if(filters?.status !== undefined){
            conditions.push(eq(statusEmpresas.status, filters.status))
        }

        if(conditions.length > 0){
            return await db.select(this.baseSelect).from(statusEmpresas).where(and(...conditions))
        }
        return await db.select(this.baseSelect).from(statusEmpresas)
    }

    async create(data: StatusEmpresasInsert) {
        return await db.insert(statusEmpresas).values(data)
    }

    async update(id: number, data: StatusEmpresasSelect) {
        return await db.update(statusEmpresas).set(data).where(eq(statusEmpresas.id, id))
    }

    async delete(id: number) {
        return await db.update(statusEmpresas).set({ativo: false}).where(eq(statusEmpresas.id, id))
    }

}