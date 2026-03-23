import axios from "axios";

export async function getFields() {
    const response = await axios.get(`/api/empresas/fields`);
    return response.data;
}

export type UpdateCamposDataTypes = {
    nome?: string,
    entidade?: number,
    tipo?: string,
    ativo?: boolean,
    config?: string,
    data_type?: string
}

export async function updateField(id: string, data: UpdateCamposDataTypes) {
    return await axios.put(`/api/empresas/fields?id=${id}`, data);
}

export async function createField(data: UpdateCamposDataTypes) {
    return await axios.post(`/api/empresas/fields`, data);
}