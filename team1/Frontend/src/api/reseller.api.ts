import axiosClient from "./axiosClient";

export const ResellerApi = {
    getAll: async (limit: number = 0) => {
        const res = await axiosClient.get(`/resellers?limit=${limit}`);
        return res.data;
    },


    //search: string, page: number


    getById: async (id: number) => {
        const res = await axiosClient.get(`/resellers/${id}`);
        return res.data;
    },

    create: async (data: any) => {
        const res = await axiosClient.post("/resellers", data);
        return res.data;
    },

    update: async (id: number, data: any) => {
        const res = await axiosClient.put(`/resellers/${id}`, data);
        return res.data;
    },

    delete: async (id: number) => {
        const res = await axiosClient.delete(`/resellers/${id}`);
        return res.data;
    },
};

export default ResellerApi;
