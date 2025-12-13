import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ResellerApi } from "@/api/reseller.api";
import { RESELLER_KEYS } from "./useResellers";

export function useResellerForm(id?: number) {
    const qc = useQueryClient();

    const create = useMutation({
        mutationFn: ResellerApi.create,
        onSuccess: () => qc.invalidateQueries({ queryKey: RESELLER_KEYS.all }),
    });

    const update = useMutation({
        mutationFn: (data: any) => ResellerApi.update(id!, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: RESELLER_KEYS.all });
            qc.invalidateQueries({ queryKey: RESELLER_KEYS.detail(id!) });
        },
    });

    const remove = useMutation({
        mutationFn: (id: number) => ResellerApi.delete(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: RESELLER_KEYS.all }),
    });

    return { create, update, remove };
}
