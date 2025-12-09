import axiosClient from "./axiosClient";

export const AddressApi = {
    getAll: async (limit: number = 0) => {
        const res = await axiosClient.get(`/addresses?limit=${limit}`);
        return res.data;
    },


    getById: async (id: number) => {
        const res = await axiosClient.get(`/addresses/${id}`);
        return res.data;
    },

    create: async (data: any) => {
        const res = await axiosClient.post("/addresses", data);
        return res.data;
    },

    update: async (id: number, data: any) => {
        const res = await axiosClient.put(`/addresses/${id}`, data);
        return res.data;
    },

    delete: async (id: number) => {
        const res = await axiosClient.delete(`/addresses/${id}`);
        return res.data;
    },
};
