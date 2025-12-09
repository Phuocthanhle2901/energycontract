// src/api/template.api.ts
import axios from "axios";

const pdfClient = axios.create({
    baseURL: "http://localhost:5001/api",
    withCredentials: false, // ❗ rất quan trọng: KHÔNG gửi cookies -> tránh lỗi CORS với '*'
});

pdfClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
        // Ép kiểu về AxiosRequestHeaders hoặc Record<string, string>
        config.headers = {
            ...(config.headers || {}),
            Authorization: `Bearer ${token}`,
        } as any;
    }

    return config;
});


export interface TemplateDto {
    id: number;
    name: string;
    description: string;
    htmlContent: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export const TemplateApi = {
    // Lấy tất cả templates
    getAll: (): Promise<TemplateDto[]> =>
        pdfClient.get("/templates").then((res) => res.data),

    // Lấy 1 template theo id
    getById: (id: number): Promise<TemplateDto> =>
        pdfClient.get(`/templates/${id}`).then((res) => res.data),

    // Tạo mới template
    create: (data: {
        name: string;
        description: string;
        htmlContent: string;
        isActive: boolean;
    }): Promise<TemplateDto> =>
        pdfClient.post("/templates", data).then((res) => res.data),

    // Cập nhật template
    update: (
        id: number,
        data: {
            description: string;
            htmlContent: string;
            isActive: boolean;
        }
    ): Promise<TemplateDto> =>
        pdfClient.put(`/templates/${id}`, data).then((res) => res.data),

    // Xoá template
    delete: (id: number): Promise<void> =>
        pdfClient.delete(`/templates/${id}`).then((res) => res.data),

    // (Option) Lấy template theo name nếu backend có route này
    getByName: (name: string): Promise<TemplateDto> =>
        pdfClient.get(`/templates/by-name/${name}`).then((res) => res.data),
};
