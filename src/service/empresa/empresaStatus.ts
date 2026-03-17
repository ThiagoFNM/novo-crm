
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