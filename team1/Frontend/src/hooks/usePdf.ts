import { useMutation, useQuery } from "@tanstack/react-query";
import { generatePdf, checkHealth } from "@/api/pdf.api";

// 🟩 Kiểm tra trạng thái PDF service
export function usePdfHealth() {
    return useQuery({
        queryKey: ["pdf-health"],
        queryFn: checkHealth,
    });
}

// 🟩 Generate PDF (trả về link hoặc file từ BE)
export function useGeneratePdf() {
    return useMutation({
        mutationFn: generatePdf,
    });
}
