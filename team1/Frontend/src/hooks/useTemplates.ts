import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TemplateApi } from "@/api/template.api";

// 🟩 Lấy tất cả template
export function useTemplates() {
    return useQuery({
        queryKey: ["templates"],
        queryFn: TemplateApi.getAll,
    });
}

// 🟩 Lấy template theo ID
export function useTemplate(id: number) {
    return useQuery({
        queryKey: ["template", id],
        queryFn: () => TemplateApi.getById(id),
        enabled: !!id,
    });
}

// 🟩 Lấy template theo tên (optional)
export function useTemplateByName(name: string) {
    return useQuery({
        queryKey: ["template-by-name", name],
        queryFn: () => TemplateApi.getByName(name),
        enabled: !!name,
    });
}

// 🟩 Create template
export function useCreateTemplate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: TemplateApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["templates"] });
        },
    });
}

// 🟩 Update template
export function useUpdateTemplate(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => TemplateApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["templates"] });
            queryClient.invalidateQueries({ queryKey: ["template", id] });
        },
    });
}

// 🟩 Delete template
export function useDeleteTemplate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: TemplateApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["templates"] });
        },
    });
}
