import axiosInstance from "../../lib/axiosInstance";

export const AddressApi = {
    getAll: async () => {
        const res = await axiosInstance.get("/addresses");
        return res.data;
    },

    getById: async (id: number) => {
        const res = await axiosInstance.get(`/addresses/${id}`);
        return res.data;
    },

    create: async (data: any) => {
        const res = await axiosInstance.post("/addresses", data);
        return res.data;
    },

    update: async (id: number, data: any) => {
        const res = await axiosInstance.put(`/addresses/${id}`, data);
        return res.data;
    },

    delete: async (id: number) => {
        const res = await axiosInstance.delete(`/addresses/${id}`);
        return res.data;
    },
};
