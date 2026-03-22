import { and, desc, eq } from "drizzle-orm";
import db from "../db";
import { setoresEmpresas } from "../db/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

type SetoresEmpresasInsert = InferInsertModel<typeof setoresEmpresas>
type SetoresEmpresasSelect = InferSelectModel<typeof setoresEmpresas>

export class EmpresasSetoresRepository {

    private baseSelect = {
        id: setoresEmpresas.id,
        setor: setoresEmpresas.setor,
        ativo: setoresEmpresas.ativo
    }

    async getMany(filters?: {ativo?:boolean, id?:number, setor?:string}) {
        const conditions = []
        if(filters?.ativo !== undefined){
            conditions.push(eq(setoresEmpresas.ativo, filters.ativo))
        }
        if(filters?.id !== undefined){
            conditions.push(eq(setoresEmpresas.id, filters.id))
        }
        if(filters?.setor !== undefined){
            conditions.push(eq(setoresEmpresas.setor, filters.setor))
        }

        if(conditions.length > 0){
            return await db.select(this.baseSelect).from(setoresEmpresas).where(and(...conditions))
        }
        return await db.select(this.baseSelect).from(setoresEmpresas).orderBy(desc(setoresEmpresas.ativo))
    }

    async create(data: SetoresEmpresasInsert) {
        return await db.insert(setoresEmpresas).values(data)
    }

    async update(id: number, data: SetoresEmpresasSelect) {
        return await db.update(setoresEmpresas).set({...data}).where(eq(setoresEmpresas.id, id))
    }

    async delete(id: number) {
        return await db.update(setoresEmpresas).set({ativo: false}).where(eq(setoresEmpresas.id, id))
    }

}