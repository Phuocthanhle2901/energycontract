import axiosClient from "./axiosClient";

export const AddressApi = {
    getAll: (params?: any) =>
        axiosClient.get("/addresses", { params }).then(res => res.data),

    getById: (id: number) =>
        axiosClient.get(`/addresses/${id}`).then(res => res.data),

    create: (data: any) =>
        axiosClient.post("/addresses", data).then(res => res.data),

    update: (id: number, data: any) =>
        axiosClient.put(`/addresses/${id}`, data).then(res => res.data),

    delete: (id: number) =>
        axiosClient.delete(`/addresses/{id}`.replace("{id}", id.toString()))
            .then(res => res.data),
};
