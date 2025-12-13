export interface GeneratePdfRequest {
    contractNumber: string;
    startDate: string;
    endDate: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    companyName: string;
    bankAccountNumber: string;
    addressLine: string;
    totalAmount: number;
    currency: string;
}

export interface GeneratePdfResponse {
    success: boolean;
    pdfUrl: string;
    fileName: string;
    errorMessage?: string;
}
