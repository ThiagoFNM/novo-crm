'use client';

import { Input } from "./input"
import { Button } from "./button"
import { z } from "zod"
import { useState } from "react"

// '(params?: string | { abort?: boolean | undefined; pattern?: RegExp | undefined; error?: string | $ZodErrorMap<$ZodIssueInvalidStringFormat> | undefined; message?: string | undefined; } | undefined): ZodString' is deprecated.ts(6385)
// schemas.d.cts(110, 9): The declaration was marked as deprecated here.

const schema = z.object({
    email_user: z.email().min(6, { message: 'Email inválido' }),
    user_pass: z.string().min(6, { message: 'Senha inválida' }),
})

type Schema = z.infer<typeof schema>

export default function FormLogin() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault()

        const result = schema.safeParse({ email_user: email, user_pass: password })

        if (!result.success) {
            setError(result.error.issues[0].message)
            return
        }

        const { email_user, user_pass } = result.data

        try {
            setIsLoading(true)
    
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email_user, user_pass }),
            })
    
            const data = await response.json()
    
            if (!response.ok) {
                setError(data.message)
                setIsLoading(false)
                return
            }

            console.log(data)
            
        } catch (error) {
            console.log(error)
            setError('Erro ao fazer login')
            setIsLoading(false)
        }

    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
                <h1>Entrar</h1>

                <Input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)}/>

                {error && <p className="text-red-500">{error}</p>}

                <Button type="submit" className="cursor-pointer">Entrar</Button>
            </div>
        </form>
    )
}