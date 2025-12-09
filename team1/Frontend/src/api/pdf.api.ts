import axios from "axios";

const pdfApi = axios.create({
    baseURL: "http://localhost:5001/api",
    headers: { "Content-Type": "application/json" },
});

export const PdfApi = {
    generateContractPdf: (data: {
        contractNumber: string;
        startDate: string;
        endDate: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        companyName: string;
        bankAccountNumber: string;
        addressLine: string;
        totalAmount: number;
        currency: string;
    }) => pdfApi.post("/pdf-contract/generate", data).then(res => res.data),

    health: () => pdfApi.get("/pdf-contract/health").then(res => res.data),
};
