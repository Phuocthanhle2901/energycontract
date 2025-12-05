import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5001/api",
});

export const templateService = {
    getAll: async () => {
        const res = await api.get("/templates");
        return res.data;
    },

    getById: async (id: number) => {
        const res = await api.get(`/templates/${id}`);
        return res.data;
    },

    create: async (data: any) => {
        const res = await api.post("/templates", data);
        return res.data;
    },

    update: async (id: number, data: any) => {
        const res = await api.put(`/templates/${id}`, data);
        return res.data;
    },

    delete: async (id: number) => {
        const res = await api.delete(`/templates/${id}`);
        return res.data;
    },

    getByName: async (name: string) => {
        const res = await api.get(`/templates/by-name/${name}`);
        return res.data;
    },
};
