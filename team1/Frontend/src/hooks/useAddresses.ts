import { useQuery } from "@tanstack/react-query";
import { AddressApi } from "@/api/address.api";

export const ADDRESS_KEYS = {
    all: ["addresses"] as const,
    list: (params: any) => ["addresses", params] as const,
    detail: (id: number) => ["address", id] as const,
};

export function useAddresses(params: any) {
    return useQuery({
        queryKey: ADDRESS_KEYS.list(params),
        queryFn: () => AddressApi.getAll(params),
    });
}

export function useAddress(id: number) {
    return useQuery({
        queryKey: ADDRESS_KEYS.detail(id),
        queryFn: () => AddressApi.getById(id),
        enabled: !!id,
    });
}
