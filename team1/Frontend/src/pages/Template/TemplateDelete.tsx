<<<<<<< HEAD
import { Box, Typography, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import NavMenu from "@/components/NavMenu/NavMenu";
import { templateService } from "../../services/pdfService/TemplateService";

export default function TemplateDelete() {
    const navigate = useNavigate();
    const { id } = useParams();

    const handleDelete = async () => {
        await templateService.delete(Number(id));
        navigate("/templates");
    };

    return (
        <>
            <NavMenu />
            <Box sx={{ p: 4, ml: "240px" }}>
                <Typography variant="h5" fontWeight={700} mb={3}>
                    Are you sure you want to delete this template?
                </Typography>

                <Button variant="contained" color="error" sx={{ mr: 2 }} onClick={handleDelete}>
                    Yes, Delete
                </Button>

                <Button variant="outlined" onClick={() => navigate("/templates")}>
                    Cancel
                </Button>
            </Box>
        </>
    );
=======
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
>>>>>>> intern2025-team1
}
