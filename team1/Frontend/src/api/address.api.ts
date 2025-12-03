import api from "./axiosInstance";

export const AddressApi = {
    async create(data: {
        zipCode: string;
        houseNumber: string;
        extension: string;
    }) {
        const res = await api.post("/addresses", data);
        return res.data;
    },

    async getAll(limit: number = 0) {
        const res = await api.get(`/addresses?limit=${limit}`);
        return res.data;
    },

    async delete(id: number) {
        const res = await api.delete(`/addresses/${id}`);
        return res.data;
    }
};