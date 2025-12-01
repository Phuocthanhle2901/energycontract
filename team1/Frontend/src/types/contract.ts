// src/types/contract.ts

import type { ReactNode } from "react";

export interface Contract {
  address: any;
  contractNumber: ReactNode;
  orders: any;
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
  companyName: string;
  bankAccountNumber: string;
  pdfLink: string;
  resellerId: number;
  addressId: number;
}

export interface ContractSummary {
  contractNumber: string;
  customerName: string;
  email: string;
  startDate: string;
  status: string;
}
export interface ContractCreateInput {
  firstName: string;
  lastName: string;
  email: string;
  startDate: string;
  endDate: string;
  resellerId: number;
}

export interface ContractHistory {
  id: number;
  contractId: string;
  oldValue: any;
  newValue: any;
  timestamp: string;
}
