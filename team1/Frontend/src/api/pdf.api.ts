import axios from "axios";

const pdfClient = axios.create({
    baseURL: import.meta.env.VITE_PDF_URL || "http://localhost:5001/api",
    withCredentials: false,
});

pdfClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const PdfApi = {
    generate: (data: any) =>
        pdfClient.post("/pdf-contract/generate", data).then(res => res.data),

    health: () =>
        pdfClient.get("/pdf-contract/health").then(res => res.data),
};
