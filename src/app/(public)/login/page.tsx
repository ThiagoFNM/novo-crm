import FormLogin from "@/components/ui/form-login"

export default function Login() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Entrar</h1>
            <FormLogin />
        </div>
    )
}