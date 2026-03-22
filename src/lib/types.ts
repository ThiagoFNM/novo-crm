export type Empresa = {
    id: number
    razaoSocial: string
    cnpj: string
    dsAtividadeEconomicaPrincipal: string
    setor: string
    posse: string
    trilha: string
    dominioPublico: boolean
    cep: string
    numeroEndereco: string
    criadoEm: Date
    atualizadoEm: Date
    idHubSpot: number
    parqueProduto: string
    idStatus: number
    status: string
    statusRelacionamento: string
    dtUltimaInteracao: Date
    idProprietario: number
}