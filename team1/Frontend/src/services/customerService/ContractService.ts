import axiosInstance from "../../lib/axiosInstance";

// Lấy danh sách contract
export async function getContracts() {
    const res = await axiosInstance.get("/contracts");
    return res.data;
}

// Lấy chi tiết contract
export async function getContractById(id: number) {
    const res = await axiosInstance.get(`/contracts/${id}`);
    return res.data;
}

// Tạo contract
export async function createContract(data: any) {
    const res = await axiosInstance.post("/contracts", data);
    return res.data;
}

// Update contract
export async function updateContract(id: number, data: any) {
    const res = await axiosInstance.put(`/contracts/${id}`, data);
    return res.data;
}

// Delete contract
export async function deleteContract(id: number) {
    const res = await axiosInstance.delete(`/contracts/${id}`);
    return res.data;
}

// Contract History
export async function getContractHistory(contractNumber: string) {
    const res = await axiosInstance.get(`/contracts/${contractNumber}/history`);
    return res.data;
}
