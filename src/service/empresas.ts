import axios from "axios";

export async function getEmpresas(page: number, limit: number, sort: string, order: string, filters: any[] = []) {
    const filterParams = filters.map(f => `&${f.id}=${f.value || ''}`).join('');
    return await axios.get(`/api/empresas?page=${page}&limit=${limit}&sort=${sort}&order=${order}${filterParams}`);
}