import axios from "axios";

export async function getEmpresas(page: number, limit: number) {
    return await axios.get(`/api/empresas?page=${page}&limit=${limit}`);
}