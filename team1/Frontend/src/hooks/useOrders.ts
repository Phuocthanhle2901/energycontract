// src/hooks/useOrders.ts
import { useQuery } from "@tanstack/react-query";
import { OrderApi } from "@/api/order.api";

export const ORDER_KEYS = {
    list: (params?: any) => ["orders", params] as const,
    detail: (id: number) => ["order", id] as const,
};

export function useOrders(params?: any) {
    return useQuery({
        queryKey: ORDER_KEYS.list(params),
        queryFn: () => OrderApi.getAll(params),
    });
}

export function useOrder(id: number) {
    return useQuery({
        queryKey: ORDER_KEYS.detail(id),
        queryFn: () => OrderApi.getById(id),
        enabled: !!id,
    });
}
