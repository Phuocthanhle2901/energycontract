import type { Reseller } from "../types/reseller";

const resellers: Reseller[] = [
  { id: 1, name: "Energy Partner A", type: "Premium" },
  { id: 2, name: "City Power", type: "Standard" },
];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getResellers(): Promise<Reseller[]> {
  await delay(150);
  return resellers;
}
