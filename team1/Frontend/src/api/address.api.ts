import { Address } from "../types/address";

const addresses: Address[] = [
  { id: 1, zipcode: "700000", housenumber: "12", extension: "A" },
  { id: 2, zipcode: "650000", housenumber: "89", extension: "B" },
];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getAddresses(): Promise<Address[]> {
  await delay(150);
  return addresses;
}
