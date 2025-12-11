// src/api/contract.api.ts
import axiosClient from "./axiosClient";

export const ContractApi = {
    getAll: (params?: any) =>
        axiosClient.get("/contracts", { params }).then((res) => res.data),

    getById: (id: number) =>
        axiosClient.get(`/contracts/${id}`).then((res) => res.data),

    create: (data: any) =>
        axiosClient.post("/contracts", data).then((res) => res.data),

    update: (id: number, data: any) =>
        axiosClient.put(`/contracts/${id}`, data).then((res) => res.data),

    delete: (id: number) =>
        axiosClient.delete(`/contracts/${id}`).then((res) => res.data),
};
