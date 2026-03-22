import axios from "axios";
import { CreatePipelineData, UpdatePipelineData } from "@/app/infra/database/pipelines/pipelinesRepository";

export async function getPipelines(page: number, limit: number, sort: string, order: string, filters: any[] = []) {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort,
        order
    });

    filters.forEach(f => {
        try {
            // Se o valor for um JSON (caso de filtros múltiplos na mesma coluna)
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

    return await axios.get(`/api/pipelines?${params.toString()}`);
}

export function createPipeline(data: CreatePipelineData) {
    return axios.post("/api/pipelines", data)
}

export function updatePipeline(id: number, data: UpdatePipelineData) {
    return axios.put(`/api/pipelines?id=${id}`, data)
}

export function deletePipeline(id: number) {
    return axios.delete(`/api/pipelines?id=${id}`)
}