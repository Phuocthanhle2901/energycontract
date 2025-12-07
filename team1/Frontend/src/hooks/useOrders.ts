import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderApi } from "@/api/order.api";

// 🟩 Lấy danh sách orders
export function useOrders() {
    return useQuery({
        queryKey: ["orders"],
        queryFn: OrderApi.getOrders,
    });
}

// 🟩 Lấy order theo ID
export function useOrder(id: number) {
    return useQuery({
        queryKey: ["order", id],
        queryFn: () => OrderApi.getById(id),
        enabled: !!id,
    });
}

// 🟩 Lấy orders theo contractId
export function useOrdersByContract(contractId: number) {
    return useQuery({
        queryKey: ["orders", contractId],
        queryFn: () => OrderApi.getByContractId(contractId),
        enabled: !!contractId,
    });
}

// 🟩 Create order
export function useCreateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: OrderApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });
}

// 🟩 Update order
export function useUpdateOrder(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => OrderApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["order", id] });
        },
    });
}

// 🟩 Delete order
export function useDeleteOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: OrderApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });
}
