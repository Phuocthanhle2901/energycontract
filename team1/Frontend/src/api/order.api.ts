import axiosClient from "./axiosClient";

export const OrderApi = {
    getAll: (params?: any) =>
        axiosClient.get("/orders", { params }).then((res) => res.data),

    getById: (id: number) =>
        axiosClient.get(`/orders/${id}`).then((res) => res.data),

    create: (data: any) =>
        axiosClient.post("/orders", data).then((res) => res.data),

    update: (id: number, data: any) =>
        axiosClient.put(`/orders/${id}`, data).then((res) => res.data),

    delete: (id: number) =>
        axiosClient.delete(`/orders/${id}`).then((res) => res.data),
};
