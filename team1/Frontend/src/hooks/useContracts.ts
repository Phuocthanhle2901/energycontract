import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContractApi } from "@/api/contract.api";

export const CONTRACT_KEYS = {
    all: ["contracts"] as const,
    list: (params: any) => ["contracts", params] as const,
    detail: (id: number) => ["contract", id] as const,
};

// ===============================
// GET LIST CONTRACTS
// ===============================
export function useContracts(params?: any) {
    return useQuery({
        queryKey: CONTRACT_KEYS.list(params),
        queryFn: () => ContractApi.getAll(params),

        // giữ lại data cũ khi đổi trang
        placeholderData: (prev) => prev,
    });
}

// ===============================
// GET CONTRACT BY ID
// ===============================
export function useContract(id?: number) {
    return useQuery({
        queryKey: CONTRACT_KEYS.detail(id!),
        queryFn: () => ContractApi.getById(id!),
        enabled: !!id,
    });
}

// ===============================
// CREATE CONTRACT
// ===============================
export function useCreateContract() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => ContractApi.create(data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: CONTRACT_KEYS.all });
        },
    });
}

// ===============================
// UPDATE CONTRACT
// ===============================
export function useUpdateContract() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (payload: { id: number; body: any }) =>
            ContractApi.update(payload.id, payload.body),

        onSuccess: (_data, payload) => {
            qc.invalidateQueries({ queryKey: CONTRACT_KEYS.all });
            qc.invalidateQueries({ queryKey: CONTRACT_KEYS.detail(payload.id) });
        },
    });
}

// ===============================
// DELETE CONTRACT
// ===============================
export function useDeleteContract() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => ContractApi.delete(id),

        onSuccess: (_data, id) => {
            qc.invalidateQueries({ queryKey: CONTRACT_KEYS.all });
            qc.invalidateQueries({ queryKey: CONTRACT_KEYS.detail(id) });
        },
    });
}
