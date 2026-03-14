import { NextRequest } from "next/server";
import { jwtVerify } from "jose";


async function validateToken(token: string) {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload
}

async function isAuthenticated(request: NextRequest) {
    const token = request.cookies.get("token")?.value
    if (!token) {
        return false
    }
    const payload = await validateToken(token)
    return payload
}

export default isAuthenticated