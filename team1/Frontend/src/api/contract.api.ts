// src/api/contract.api.ts
import axiosInstance from "./axiosInstance";
import type { Contract, ContractSummary } from "../types/contract";




// Kiểu dữ liệu để tạo contract mới (không cần id và orders)
export type ContractCreateInput = Omit<Contract, "id" | "orders">;

// Lấy danh sách contract (có query limit nếu muốn)
export async function getContracts(limit = 0): Promise<ContractSummary[]> {
  const res = await axiosInstance.get(`/contracts?limit=${limit}`);
  return res.data;
}

// Lấy chi tiết contract theo ID
export async function getContractById(id: number): Promise<ContractSummary> {
  const res = await axiosInstance.get(`/contracts/${id}`);
  return res.data;
}

// Tạo contract mới
export async function createContract(contract: ContractCreateInput): Promise<number> {
  const res = await axiosInstance.post("/contracts", contract);
  return res.data; // API trả về ID
}

// Cập nhật contract
export async function updateContract(id: number, contract: Contract): Promise<void> {
  await axiosInstance.put(`/contracts/${id}`, contract);
}

// Xóa contract
export async function deleteContract(id: number): Promise<void> {
  await axiosInstance.delete(`/contracts/${id}`);
}
//history

export async function getContractHistory(contractNumber: string) {
  const res = await axiosInstance.get(`/contracts/${contractNumber}/history`);
  return res.data;
}