import { TemplateApi } from "@/api/template.api";
import toast from "react-hot-toast";

export async function deleteTemplate(id: number, refetch: () => void) {
    try {
        await TemplateApi.delete(id);
        toast.success("Deleted");
        refetch();
    } catch {
        toast.error("Delete failed");
    }
}
