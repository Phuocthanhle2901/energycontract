import { useQuery } from "@tanstack/react-query";
import { ResellerApi } from "@/api/reseller.api";

export const RESELLER_KEYS = {
    all: ["resellers"] as const,
    list: (params: any) => ["resellers", params] as const,
    detail: (id: number) => ["reseller", id] as const,
};

export function useResellers(params: any) {
    return useQuery({
        queryKey: RESELLER_KEYS.list(params),
        queryFn: () => ResellerApi.getAll(params),
    });
}

export function useReseller(id: number) {
    return useQuery({
        queryKey: RESELLER_KEYS.detail(id),
        queryFn: () => ResellerApi.getById(id),
        enabled: !!id,
    });
}
