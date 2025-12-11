import { useMutation } from "@tanstack/react-query";
import { PdfApi } from "@/api/pdf.api";

export function useGeneratePdf() {
    return useMutation({
        mutationFn: PdfApi.generate,
    });
}

export function usePdfHealth() {
    return useMutation({
        mutationFn: PdfApi.health,
    });
}
