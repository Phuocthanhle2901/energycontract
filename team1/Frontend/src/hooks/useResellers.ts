import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ResellerApi from "@/api/reseller.api";

// 🟩 Lấy danh sách reseller
export function useResellers() {
    return useQuery({
        queryKey: ["resellers"],
        queryFn: ResellerApi.getAll,
    });
}

// 🟩 Lấy reseller theo ID
export function useReseller(id: number) {
    return useQuery({
        queryKey: ["reseller", id],
        queryFn: () => ResellerApi.getById(id),
        enabled: !!id,
    });
}

// 🟩 Create reseller
export function useCreateReseller() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ResellerApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["resellers"] });
        },
    });
}

// 🟩 Update reseller
export function useUpdateReseller(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => ResellerApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["resellers"] });
            queryClient.invalidateQueries({ queryKey: ["reseller", id] });
        },
    });
}

// 🟩 Delete reseller
export function useDeleteReseller() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ResellerApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["resellers"] });
        },
    });
}
