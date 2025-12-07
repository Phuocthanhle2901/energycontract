import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AddressApi } from "@/api/address.api";

// 🟩 Lấy danh sách địa chỉ
// export function useAddresses() {
//     return useQuery({
//         queryKey: ["addresses"],
//         queryFn: AddressApi.getAll,
//     });
// }

// 🟩 Lấy địa chỉ theo ID
export function useAddress(id: number) {
    return useQuery({
        queryKey: ["address", id],
        queryFn: () => AddressApi.getById(id),
        enabled: !!id,
    });
}

// 🟩 Create address
export function useCreateAddress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: AddressApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
        },
    });
}

// 🟩 Update address
export function useUpdateAddress(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => AddressApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
            queryClient.invalidateQueries({ queryKey: ["address", id] });
        },
    });
}

// 🟩 Delete address
export function useDeleteAddress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: AddressApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
        },
    });
}
