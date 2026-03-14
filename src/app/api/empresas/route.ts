import { NextResponse } from "next/server";
import db from "@/db"
import { empresas } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 10
    const result = await db.select().from(empresas).limit(limit).offset((page - 1) * limit)
    const total = await db.select({ count: sql`count(*)` }).from(empresas)

    return NextResponse.json({ empresas: result, total: Number(total[0].count) })
}