export function FormLabel({ children, required }: { children: React.ReactNode, required?: boolean }) {
    return (
        <label className="text-sm font-medium">
            {children}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
    )
}
