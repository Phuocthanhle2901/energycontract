export interface ContractResponse {
  id: number;
  contractNumber: string;
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
