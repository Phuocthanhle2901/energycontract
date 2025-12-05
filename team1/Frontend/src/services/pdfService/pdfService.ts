import axiosInstance from "@/lib/axiosInstance";


export async function generatePdf(data: any) {
    const res = await axiosInstance.post("/pdf-contract/generate", data);
    return res.data;
}

export async function checkHealth() {
    return axiosInstance.get("/pdf-contract/health");
}
