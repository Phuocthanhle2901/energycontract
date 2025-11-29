import axiosInstance from "./axiosInstance";

export type ContractPdfInfo = {
  contractNumber: string;
  customerName: string;
  startDate: string;
  endDate: string;
  resellerName: string;
  address: string;
  orders: { orderNumber: string; type: string; status: string; startDate: string; endDate: string }[];
  generatedAt: string;
  pdfUrl?: string; // link thực nếu có
};

export async function getContractPdfInfo(contractId: number): Promise<ContractPdfInfo> {
  const res = await axiosInstance.get(`/contracts/${contractId}/pdf`);
  return res.data;
}
