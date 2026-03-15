//formatar cep

export function formatarCEP(cep: string) {
    if (!cep) return "";
    return cep.replace(/(\d{5})(\d{3})/g, '$1-$2')
}