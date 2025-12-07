import axios from "axios";

const pdfApi = axios.create({
    baseURL: "http://localhost:5001/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export const PdfApi = {
    generate: async (data: any) => {
        const res = await pdfApi.post("/pdf-contract/generate", data);
        return res.data;
    },

    health: async () => {
        const res = await pdfApi.get("/pdf-contract/health");
        return res.data;
    }
};
