import api from '@/lib/axios.ts';
import type {Reseller} from "@/types/reseller.ts";

const endpoint = '/resellers';

const resellerService = {
    getAll: async (limit?: number) => {
        const params = limit && limit > 0 ? { limit } : {};
        const response = await api.get<Reseller[]>(endpoint, { params });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<Reseller>(`${endpoint}/${id}`);
        return response.data;
    },

    create: async (data: Omit<Reseller, 'id'>) => {
        const response = await api.post<number>(endpoint, data);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`${endpoint}/${id}`);
    }
};

export default resellerService;