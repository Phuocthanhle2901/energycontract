import axiosClient from "./axiosClient";

export const ContractApi = {
    getContracts: async () => {
        const res = await axiosClient.get("/contracts");
        return res.data;
    },

    getById: async (id: number) => {
        const res = await axiosClient.get(`/contracts/${id}`);
        return res.data;
    },

    create: async (data: any) => {
        const res = await axiosClient.post("/contracts", data);
        return res.data;
    },

    update: async (id: number, data: any) => {
        const res = await axiosClient.put(`/contracts/${id}`, data);
        return res.data;
    },

    delete: async (id: number) => {
        const res = await axiosClient.delete(`/contracts/${id}`);
        return res.data;
    },
};
