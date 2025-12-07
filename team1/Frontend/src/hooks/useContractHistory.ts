import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContractHistoryApi } from "@/api/contractHistory.api";

// 🟩 Lấy lịch sử theo contractId
export function useContractHistory(contractId: number) {
    return useQuery({
        queryKey: ["contract-history", contractId],
        queryFn: () => ContractHistoryApi.getByContractId(contractId),
        enabled: !!contractId,
    });
}

// 🟩 Tạo bản ghi history
export function useCreateContractHistory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ContractHistoryApi.create,
        onSuccess: (_, data) => {
            // Khi thêm history mới, refresh lịch sử của đúng contract
            if (data?.contractId) {
                queryClient.invalidateQueries({
                    queryKey: ["contract-history", data.contractId],
                });
            }
        },
    });
}
