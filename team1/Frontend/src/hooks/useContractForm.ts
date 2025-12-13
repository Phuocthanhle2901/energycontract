import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContractApi } from "@/api/contract.api";
import { CONTRACT_KEYS } from "./useContracts";

export function useContractForm(id?: number) {
    const qc = useQueryClient();

    const create = useMutation({
        mutationFn: ContractApi.create,
        onSuccess: () => qc.invalidateQueries({ queryKey: CONTRACT_KEYS.all }),
    });

    const update = useMutation({
        mutationFn: (data: any) => ContractApi.update(id!, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: CONTRACT_KEYS.all });
            qc.invalidateQueries({ queryKey: CONTRACT_KEYS.detail(id!) });
        },
    });

    const remove = useMutation({
        mutationFn: (id: number) => ContractApi.delete(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: CONTRACT_KEYS.all }),
    });

    return { create, update, remove };
}
