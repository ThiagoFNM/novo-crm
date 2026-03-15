// formato atual de data 2025-10-30T15:35:34.560Z
// formato desejado 30/10/2025

export function formatarData(data: string) {
    return data.split('T')[0].split('-').reverse().join('/')
}