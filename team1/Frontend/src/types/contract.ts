<<<<<<< HEAD
export interface ContractResponse {
  id: number;
  contractNumber: string;
=======


import type { ReactNode } from "react";

export interface Contract {
  resellerName: ReactNode;
  contractNumber: ReactNode;
  address: any;

  orders: any;
  id?: number;
>>>>>>> intern2025-team1
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  startDate: string;
  endDate: string;
  status: string;
  bankAccountNumber: string;
  pdfLink: string;
  resellerId: number;
  addressId: number;
}

export interface ContractCreateInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  startDate: string;
  endDate: string;
  bankAccountNumber: string;
  pdfLink: string;
  resellerId: number;
  addressId: number;
}
