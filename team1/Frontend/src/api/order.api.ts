import { Order } from "../types/order";
import { getContractById } from "./contract.api";

export async function getOrdersByContractId(
  contractId: number
): Promise<Order[]> {
  const c = await getContractById(contractId);
  return c?.orders ?? [];
}
