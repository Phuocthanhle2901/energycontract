// src/hooks/useOrderForm.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderApi } from "@/api/order.api";
import { ORDER_KEYS } from "./useOrders";

export function useOrderForm(orderId?: number) {
    const qc = useQueryClient();

    const create = useMutation({
        mutationFn: OrderApi.create,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ORDER_KEYS.list(undefined) });
        },
    });

    const update = useMutation({
        mutationFn: (data: any) => OrderApi.update(orderId!, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ORDER_KEYS.list(undefined) });
            qc.invalidateQueries({ queryKey: ORDER_KEYS.detail(orderId!) });
        },
    });

    return { create, update };
}

export function useUpdateOrder(orderId: number) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => OrderApi.update(orderId, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ORDER_KEYS.list(undefined) });
            qc.invalidateQueries({ queryKey: ORDER_KEYS.detail(orderId) });
        },
    });
}

export function useDeleteOrder() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => OrderApi.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ORDER_KEYS.list(undefined) });
        },
    });
}
