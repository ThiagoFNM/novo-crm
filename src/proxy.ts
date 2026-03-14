import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import isAuthenticated from "./lib/auth";

const PUBLIC_ROTES = [
    '/login',
    '/api/auth/login'
]

export function isPublicRoute(pathname: string) {
    return PUBLIC_ROTES.includes(pathname)
}

export default async function proxy(request: NextRequest) {

    const isAuth = await isAuthenticated(request)
    const isPublic = isPublicRoute(request.nextUrl.pathname)

    if (!isAuth && !isPublic) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (isAuth && isPublic) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};