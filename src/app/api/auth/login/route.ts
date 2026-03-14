import db from '@/db'
import { NextResponse } from 'next/server'
import { cargosInPortal, departamentosInPortal, equipesInPortal, rolesInPortal, usuariosInPortal } from '@/db/schema'
import { and, eq, SQL } from 'drizzle-orm'
import { verifyHashPassword } from '@/lib/verifyhash'
import { generateToken } from '@/lib/token'

interface LoginBody {
    email_user: string;
    user_pass: string;
}

const attemps = new Map<string, { count: number; timestamp: number }>();

export async function POST(request: Request) {

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? "unknown";

    const now = new Date();
    const windowMs = 60_000; // 1 minuto
    const maxAttempts = 5;
    const isProd = process.env.NODE_ENV === "production"

    try {
        const body = await request.json() as LoginBody;

        const { email_user, user_pass } = body;

        const senha = user_pass.trim();

        if (!email_user || !senha) {
            return NextResponse.json({ message: "Credênciais inválidas" })
        }

        const filters: SQL[] = [
            eq(usuariosInPortal.email, email_user),
            eq(usuariosInPortal.ativo, true)
        ]

        const key = `${ip}-${email_user}`;
        const entry = attemps.get(key);

        //BLOQUEIO DE TENTATIVAS
        if (entry && now.getTime() - entry.timestamp < windowMs && entry.count >= maxAttempts) {
            return NextResponse.json(
                { message: "Muitas tentativas. Aguarde 1 minuto." },
                { status: 429 }
            );
        }

        const consulta = await db.select({
            id: usuariosInPortal.id,
            nome: usuariosInPortal.nome,
            sobrenome: usuariosInPortal.sobrenome,
            senha: usuariosInPortal.senha,
            email: usuariosInPortal.email,
            cargo: cargosInPortal.nomeCargo,
            equipe: equipesInPortal.nomeEquipe,
            dp: departamentosInPortal.nomeDp,
            role: rolesInPortal.nomeRole,
            primeiroAcesso: usuariosInPortal.primeiroAcesso,
            tokenPrimeiroAcesso: usuariosInPortal.tokenPrimeiroAcesso,
            tokenExpiraEm: usuariosInPortal.tokenExpiraEm,

        })
            .from(usuariosInPortal)
            .leftJoin(equipesInPortal, eq(equipesInPortal.id, usuariosInPortal.idEquipe))
            .leftJoin(cargosInPortal, eq(cargosInPortal.id, usuariosInPortal.idCargo))
            .leftJoin(departamentosInPortal, eq(departamentosInPortal.id, usuariosInPortal.idDp))
            .leftJoin(rolesInPortal, eq(rolesInPortal.id, usuariosInPortal.idRole))
            .where(and(...filters))
            .limit(1)

        const user = consulta[0]

        if (!user) {

            return NextResponse.json(
                { message: "Credenciais inválidas" },
                { status: 401 }
            )
        }

        if (user.primeiroAcesso) {
            return NextResponse.json({ message: "Primeiro acesso, por favor redefina sua senha.", primeiroAcesso: true }, { status: 403 });
        }

        if (user.tokenExpiraEm) {
            const tokenExpiraEmDate = new Date(user.tokenExpiraEm);
            if (tokenExpiraEmDate < new Date()) {
                return NextResponse.json({ message: "Token de primeiro acesso expirado, solicite um novo.", primeiroAcesso: true }, { status: 403 });
            }
        }

        const bypass = await verifyHashPassword(senha, user.senha!)

        console.log(bypass)

        if (!bypass) {

            if (!entry || now.getTime() - entry.timestamp > windowMs) {
                attemps.set(key, { count: 1, timestamp: now.getTime() });
            } else {
                entry.count++;
                entry.timestamp = now.getTime();
            }

            const updated = attemps.get(key);
            await new Promise(resolve => setTimeout(resolve, updated!.count * 1000));
            return NextResponse.json({ message: "Credenciais inválidas" }, { status: 401 });

        }

        // jwt
        const token = await generateToken({
            id: user.id,
            nome: user.nome ?? '',
            cargo: user.cargo ?? '',
            eq: user.equipe ?? '',
            dp: user.dp ?? '',
            email: user.email ?? '',
            role: user.role ?? ''
        })

        const response = NextResponse.json({
            user,
            success: true
        })

        response.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            domain: isProd ? '.noatec.com.br' : 'localhost',
            path: '/',
            maxAge: 60 * 60 * 24
        })

        attemps.delete(key);

        return response
    } catch (e) {
        console.log('Erro: API -', (e as Error).message)

        const response = {
            error: (e as Error).message,
            returnedStatus: 500,
        }

        return NextResponse.json(response, { status: 500 })
    }
}