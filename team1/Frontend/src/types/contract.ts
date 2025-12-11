export interface ContractCreate {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  startDate: string;
  endDate: string;
  companyName: string;
  bankAccountNumber: string;
  pdfLink: string;
  resellerId: number;
  addressId: number;
}

export interface ContractDto {
  id: number;
  contractNumber: string;
  firstName: string;
  lastName: string;
  customerName: string;
  email: string;
  phone: string;
  companyName: string;
  startDate: string;
  endDate: string;
  bankAccountNumber: string;
  pdfLink: string;
  addressId: number;
  addressZipCode: string;
  addressHouseNumber: string;
  resellerId: number;
  resellerName: string;
  resellerType: string;
}

export interface ContractPaged {
  items: ContractDto[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
