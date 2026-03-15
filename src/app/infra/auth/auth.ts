import { jwtVerify } from "jose";

export class Auth {
    constructor(
        public readonly id: number,
        public readonly email: string,
        public readonly password: string,
        public readonly idProfile: number
    ) { }



    async validateToken(token: string) {
        if (!token) {
            throw new Error("Token inválido");
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET)

        const { payload } = await jwtVerify(token, secret)
        return payload
    }

    async isAuthenticated() {
        const token = localStorage.getItem("token")
        if (!token) {
            return false
        }
        const payload = await this.validateToken(token)
        return payload
    }
    
}