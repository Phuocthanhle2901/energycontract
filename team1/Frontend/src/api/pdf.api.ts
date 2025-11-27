export interface ContractPdfInfo {
  contractId: number;
  url: string;
  generatedAt: string;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getContractPdfInfo(
  contractId: number
): Promise<ContractPdfInfo> {
  await delay(200);
  return {
    contractId,
    url: "#", // chưa có file thật, chỉ demo giao diện
    generatedAt: "2025-01-05T10:00:00Z",
  };
}
