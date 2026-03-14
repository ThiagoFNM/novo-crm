import { SignJWT } from "jose";

export async function generateToken(user: {    
    id: number;
    nome: string;
    cargo: string;
    eq: string;
    dp: string;
    email: string;
    role: string;
    }) {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)

    const token = await new SignJWT(user)
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('1d')
        .sign(secret)

    return token
}