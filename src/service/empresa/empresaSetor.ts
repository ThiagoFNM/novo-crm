
import axios from "axios";
// Formato desejado: /api/empresas/status?filter=id:igual:1&filter=status:contem:ativo&filter=ativo:igual:true

export async function getEmpresaSetores(filters: any[] = []) {
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

    return await axios.get(`/api/empresas/setores?${params.toString()}`);
}

export async function createEmpresaSetor(data: any) {
    return await axios.post(`/api/empresas/setores`, data);
}

export async function deleteEmpresaSetor(id: number) {
    return await axios.delete(`/api/empresas/setores?id=${id}`);
}

export type UpdateEmpresaSetorDatTypes = {
    setor?: string,
    ativo?: boolean
}

export async function updateEmpresaSetor(id: number, data: UpdateEmpresaSetorDatTypes) {
    return await axios.put(`/api/empresas/setores?id=${id}`, data);
}