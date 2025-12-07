import axios from "axios";

const pdfApi = axios.create({
    baseURL: "http://localhost:5001/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export const TemplateApi = {
    getAll: async () => {
        const res = await pdfApi.get("/templates");
        return res.data;
    },

    getById: async (id: number) => {
        const res = await pdfApi.get(`/templates/${id}`);
        return res.data;
    },

    create: async (data: any) => {
        const res = await pdfApi.post("/templates", data);
        return res.data;
    },

    update: async (id: number, data: any) => {
        const res = await pdfApi.put(`/templates/${id}`, data);
        return res.data;
    },

    delete: async (id: number) => {
        const res = await pdfApi.delete(`/templates/${id}`);
        return res.data;
    },

    getByName: async (name: string) => {
        const res = await pdfApi.get(`/templates/by-name/${name}`);
        return res.data;
    },
};
