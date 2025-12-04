import axiosInstance from "../../lib/axiosInstance";

export const ResellerApi = {
    getAll: async () => {
        const res = await axiosInstance.get("/resellers");
        return res.data;
    },

    getById: async (id: number) => {
        const res = await axiosInstance.get(`/resellers/${id}`);
        return res.data;
    },

    create: async (data: any) => {
        const res = await axiosInstance.post("/resellers", data);
        return res.data;
    },

    update: async (id: number, data: any) => {
        const res = await axiosInstance.put(`/resellers/${id}`, data);
        return res.data;
    },

    delete: async (id: number) => {
        const res = await axiosInstance.delete(`/resellers/${id}`);
        return res.data;
    },
};
export default ResellerApi;
