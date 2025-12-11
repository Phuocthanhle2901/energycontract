import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContractHistoryApi } from "@/api/contractHistory.api";

export const HISTORY_KEYS = {
    list: (contractId: number) => ["contract-history", contractId] as const,
};

export function useContractHistory(contractId: number) {
    return useQuery({
        queryKey: HISTORY_KEYS.list(contractId),
        queryFn: () => ContractHistoryApi.getByContractId(contractId),
        enabled: !!contractId,
    });
}

export function useContractHistoryForm() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ContractHistoryApi.create,
        onSuccess: (_data, variables: any) =>
            qc.invalidateQueries({
                queryKey: HISTORY_KEYS.list(variables.contractId),
            }),
    });
}
