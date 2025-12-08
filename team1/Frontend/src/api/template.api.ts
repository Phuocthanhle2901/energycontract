import axios from "axios";

const pdfApi = axios.create({
    baseURL: "http://localhost:5001/api", // đúng port PDF service
    headers: { "Content-Type": "application/json" },
});

export const TemplateApi = {
    getAll: () => pdfApi.get("/templates").then(res => res.data),

    getById: (id: number) => pdfApi.get(`/templates/${id}`).then(res => res.data),

    create: (data: {
        name: string;
        description: string;
        htmlContent: string;
        isActive: boolean;
    }) => pdfApi.post("/templates", data).then(res => res.data),

    update: (id: number, data: {
        description: string;
        htmlContent: string;
        isActive: boolean;
    }) => pdfApi.put(`/templates/${id}`, data).then(res => res.data),

    delete: (id: number) => pdfApi.delete(`/templates/${id}`).then(res => res.data),

    getByName: (name: string) =>
        pdfApi.get(`/templates/by-name/${name}`).then(res => res.data),
};
