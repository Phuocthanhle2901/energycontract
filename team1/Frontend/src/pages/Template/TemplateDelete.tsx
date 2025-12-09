import { TemplateApi } from "@/api/template.api";
import toast from "react-hot-toast";

/**
 * Helper dùng để xoá template + gọi lại refetch list.
 * Có thể dùng lại ở nhiều nơi (TemplateList, dialog riêng, v.v.)
 */
export async function deleteTemplate(
    id: number,
    refetch?: () => void
): Promise<void> {
    try {
        await TemplateApi.delete(id);
        toast.success("Template deleted successfully");
        if (refetch) {
            refetch();
        }
    } catch (error) {
        console.error(error);
        toast.error("Failed to delete template");
    }
}
