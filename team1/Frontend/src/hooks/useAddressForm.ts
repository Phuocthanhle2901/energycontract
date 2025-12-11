import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddressApi } from "@/api/address.api";
import { ADDRESS_KEYS } from "./useAddresses";

export function useAddressForm(id?: number) {
    const qc = useQueryClient();

    const create = useMutation({
        mutationFn: AddressApi.create,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ADDRESS_KEYS.all });
        },
    });

    const update = useMutation({
        mutationFn: (data: any) => AddressApi.update(id!, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ADDRESS_KEYS.all });
            qc.invalidateQueries({ queryKey: ADDRESS_KEYS.detail(id!) });
        },
    });

    const remove = useMutation({
        mutationFn: (id: number) => AddressApi.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ADDRESS_KEYS.all });
        },
    });

    return { create, update, remove };
}
