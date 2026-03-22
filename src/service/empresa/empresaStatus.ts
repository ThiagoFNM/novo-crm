
import axios from "axios";
// Formato desejado: /api/empresas/status?filter=id:igual:1&filter=status:contem:ativo&filter=ativo:igual:true

export async function getEmpresaStatus(filters: any[] = []) {
    const params = new URLSearchParams();

    filters.forEach(f => {
        try {
            const values = JSON.parse(f.value);
            if (Array.isArray(values)) {
                values.forEach((v: any) => {
                    params.append('filter', `${f.id}:${v.condition || 'igual'}:${v.value}`);
                });
                return;
            }
        } catch {
            // Se não for JSON, trata como valor simples
        }

        // Caso seja um filtro simples ou falhe o parse JSON
        // Verifica se f tem condition (alguns filtros podem vir estruturados assim)
        const condition = f.condition || 'igual';
        const value = f.value || '';
        if (value) {
            params.append('filter', `${f.id}:${condition}:${value}`);
        }
    });

    return await axios.get(`/api/empresas/status?${params.toString()}`);
}

export async function createEmpresaStatus(data: any) {
    return await axios.post(`/api/empresas/status`, data);
}

export async function deleteEmpresaStatus(id: number) {
    return await axios.delete(`/api/empresas/status?id=${id}`);
}

export type UpdateEmpresaStatusDatTypes = {
    status?: string,
    cor?: string,
    ativo?: boolean
}

export async function updateEmpresaStatus(id: number, data: UpdateEmpresaStatusDatTypes) {
    return await axios.put(`/api/empresas/status?id=${id}`, data);
}