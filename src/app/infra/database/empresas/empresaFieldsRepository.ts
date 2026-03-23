import { UpdateCamposDataTypes } from "@/service/empresa/empresaCampos";
import db from "../db";
import { customFields } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import { InferInsertModel } from "drizzle-orm";

type EmpresaFieldsInsert = InferInsertModel<typeof customFields>

export class EmpresaFieldsRepository {

    async getFields() {

        const result = await db.execute<any>(sql`
            SELECT DISTINCT ON (column_name)
                CONCAT('fixed_', column_name) as id,
                column_name as nome,
                CASE 
                    WHEN data_type = 'character varying' THEN 'Texto'
                    WHEN data_type = 'text' THEN 'Texto Longo'
                    WHEN data_type = 'timestamp without time zone' THEN 'Data'
                    WHEN data_type = 'double precision' THEN 'Moeda'
                    WHEN data_type = 'bigint' THEN 'Número'
                    WHEN data_type = 'integer' THEN 'Número'
                    WHEN data_type = 'numeric' THEN 'Moeda'
                    WHEN data_type = 'boolean' THEN 'Sim/Não'
                    ELSE data_type
                END as data_type,
                'fixed'::text as tipo,
                'true'::boolean as ativo
            FROM information_schema.columns
            WHERE table_name = 'empresas'
                AND column_name <> 'custom_fields'
            ORDER BY column_name
        `);
        const colunasFixas = result.rows || result;

        const colunasCustom = await db.select({
            id: sql`id::text`,
            nome: sql`nome::text`,
            data_type: sql`
                CASE 
                    WHEN tipo = 'text' THEN 'Texto'
                    WHEN tipo = 'long_text' THEN 'Texto Longo'
                    WHEN tipo = 'number' THEN 'Número'
                    WHEN tipo = 'select' THEN 'Seleção'
                    WHEN tipo = 'date' THEN 'Data'
                    WHEN tipo = 'moeda' THEN 'Moeda'
                    WHEN tipo = 'boolean' THEN 'Sim/Não'
                    ELSE tipo
                END`,
            tipo: sql`'custom'`,
            ativo: sql`ativo`
        }).from(customFields)
            .where(eq(customFields.entidade_id, 1));

        return [...colunasFixas, ...colunasCustom];
    }

    async updateField(id: string, data: UpdateCamposDataTypes) {
        return await db.update(customFields).set(data).where(eq(customFields.id, Number(id)));
    }

    async createField(data: EmpresaFieldsInsert) {
        return await db.insert(customFields).values(data);
    }

    async deleteField(id: string) {
        return await db.delete(customFields).where(eq(customFields.id, Number(id)));
    }


}