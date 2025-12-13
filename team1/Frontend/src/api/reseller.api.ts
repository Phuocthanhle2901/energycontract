import axiosClient from "./axiosClient";

export const ResellerApi = {
    getAll: (params?: any) =>
        axiosClient.get("/resellers", { params }).then(res => res.data),

    getById: (id: number) =>
        axiosClient.get(`/resellers/${id}`).then(res => res.data),

    create: (data: any) =>
        axiosClient.post("/resellers", data).then(res => res.data),

    update: (id: number, data: any) =>
        axiosClient.put(`/resellers/${id}`, data).then(res => res.data),

    delete: (id: number) =>
        axiosClient.delete(`/resellers/${id}`).then(res => res.data),
};
