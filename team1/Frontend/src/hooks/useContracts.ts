import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContractApi } from "@/api/contract.api";

// 🟩 Lấy danh sách contract
export function useContracts() {
    return useQuery({
        queryKey: ["contracts"],
        queryFn: ContractApi.getContracts,
    });
}

// 🟩 Lấy 1 contract theo ID
export function useContract(id: number) {
    return useQuery({
        queryKey: ["contract", id],
        queryFn: () => ContractApi.getById(id),
        enabled: !!id, // chỉ chạy khi id tồn tại
    });
}

// 🟩 Tạo contract
export function useCreateContract() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ContractApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contracts"] });
        },
    });
}

// 🟩 Update contract
export function useUpdateContract(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => ContractApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contracts"] });
            queryClient.invalidateQueries({ queryKey: ["contract", id] });
        },
    });
}

// 🟩 Delete contract
export function useDeleteContract() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => ContractApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contracts"] });
        },
    });
}
