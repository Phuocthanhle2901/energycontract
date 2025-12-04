import type {Reseller} from "@/types/reseller.ts";
import api_customer from "@/lib/api/api_customer.ts";

const endpoint = '/resellers';

const resellerService = {
    getAll: async (limit?: number) => {
        const params = limit && limit > 0 ? { limit } : {};
        // ⚠️ response ở đây chính là data thật (Array)
        const response = await api_customer.get<Reseller[]>(endpoint, { params });

        // 🔴 SỬA: return response (bỏ .data)
        return response as unknown as Reseller[];
    },

    getById: async (id: number) => {
        const response = await api_customer.get<Reseller>(`${endpoint}/${id}`);
        // 🔴 SỬA: return response (bỏ .data)
        return response as unknown as Reseller;
    },

    create: async (data: Omit<Reseller, 'id'>) => {
        const response = await api_customer.post<number>(endpoint, data);
        // 🔴 SỬA: return response (bỏ .data)
        return response as unknown as number;
    },

    delete: async (id: number) => {
        await api_customer.delete(`${endpoint}/${id}`);
    }
};

export default resellerService;