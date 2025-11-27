import { Contract, ContractHistory } from "../types/contract";
import { Reseller } from "../types/reseller";
import { Address } from "../types/address";
import { Order } from "../types/order";

const resellerA: Reseller = {
  id: 1,
  name: "Energy Partner A",
  type: "Premium",
};
const resellerB: Reseller = { id: 2, name: "City Power", type: "Standard" };

const addr1: Address = {
  id: 1,
  zipcode: "700000",
  housenumber: "12",
  extension: "A",
};
const addr2: Address = {
  id: 2,
  zipcode: "650000",
  housenumber: "89",
  extension: "B",
};

const orders: Order[] = [
  {
    id: 1,
    contractId: 1,
    orderNumber: "ORD-GAS-001",
    orderType: "gas",
    status: "Active",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    topupFee: 150000,
  },
  {
    id: 2,
    contractId: 1,
    orderNumber: "ORD-ELE-001",
    orderType: "electricity",
    status: "Pending",
    startDate: "2025-02-01",
    endDate: "2025-12-31",
    topupFee: 200000,
  },
];

const contracts: Contract[] = [
  {
    id: 1,
    contractNumber: "CT-2025-0001",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    firstname: "Nguyen",
    lastname: "An",
    email: "nguyen.an@example.com",
    phone: "0901234567",
    companyName: "An Energy Co.",
    bankAccountNumber: "0123456789",
    reseller: resellerA,
    address: addr1,
    orders: orders.filter((o) => o.contractId === 1),
    pdfGeneratedAt: "2025-01-05T10:00:00Z",
  },
  {
    id: 2,
    contractNumber: "CT-2025-0002",
    startDate: "2025-03-01",
    endDate: "2025-09-30",
    firstname: "Le",
    lastname: "Binh",
    email: "le.binh@example.com",
    phone: "0909876543",
    companyName: "Binh Trading",
    bankAccountNumber: "0987654321",
    reseller: resellerB,
    address: addr2,
    orders: [],
  },
];

const histories: ContractHistory[] = [
  {
    id: 1,
    contractId: 1,
    changedAt: "2025-01-02T09:00:00Z",
    summary: "Created contract CT-2025-0001.",
  },
  {
    id: 2,
    contractId: 1,
    changedAt: "2025-01-10T08:30:00Z",
    summary: "Added electricity order ORD-ELE-001.",
  },
];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getContracts(): Promise<Contract[]> {
  await delay(200);
  return contracts;
}

export async function getContractById(
  id: number
): Promise<Contract | undefined> {
  await delay(200);
  return contracts.find((c) => c.id === id);
}

export async function getContractHistory(
  contractId: number
): Promise<ContractHistory[]> {
  await delay(200);
  return histories.filter((h) => h.contractId === contractId);
}

// Mock create/update/delete chỉ để demo UI
export async function createContractMock(): Promise<void> {
  await delay(300);
}

export async function updateContractMock(): Promise<void> {
  await delay(300);
}

export async function deleteContractMock(): Promise<void> {
  await delay(300);
}
