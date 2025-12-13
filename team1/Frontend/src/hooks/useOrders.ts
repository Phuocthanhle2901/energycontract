import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderApi } from "@/api/order.api";

export const ORDER_KEYS = {
    all: ["orders"],
    list: (params: any) => ["orders", params],
    detail: (id) => ["order", id],
};

// =========================
// GET LIST ORDERS
// =========================
export function useOrders(params: any) {
    return useQuery({
        queryKey: ORDER_KEYS.list(params),
        queryFn: () => OrderApi.getAll(params),
        placeholderData: (prev) => prev,
    });
}

// =========================
// GET ONE ORDER BY ID
// =========================
export function useOrder(id) {
    return useQuery({
        queryKey: ORDER_KEYS.detail(id),
        queryFn: () => OrderApi.getById(id),
        enabled: !!id,
    });
}

// =========================
// CREATE ORDER
// =========================
export function useCreateOrder() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (body) => OrderApi.create(body),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ORDER_KEYS.all });
        },
    });
}

// =========================
// UPDATE ORDER
// =========================
export function useUpdateOrder() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, body }) => OrderApi.update(id, body),
        onSuccess: (_, { id }) => {
            qc.invalidateQueries({ queryKey: ORDER_KEYS.all });
            qc.invalidateQueries({ queryKey: ORDER_KEYS.detail(id) });
        },
    });
}

// =========================
// DELETE ORDER
// =========================
export function useDeleteOrder() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id) => OrderApi.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ORDER_KEYS.all });
        },
    });
}
