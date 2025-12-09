import {
    Box,
    Button,
    Typography,
    Stack
} from "@mui/material";

import NavMenu from "@/components/NavMenu/NavMenu";
import { useNavigate, useParams } from "react-router-dom";

import { useDeleteReseller } from "@/hooks/useResellers";

export default function ResellerDelete() {

    const navigate = useNavigate();
    const { id } = useParams();

    // 🔥 KHÔNG TRUYỀN ID VÀO ĐÂY — HOOK KHÔNG NHẬN ARGUMENT
    const deleteReseller = useDeleteReseller();

    const handleDelete = () => {
        deleteReseller.mutate(Number(id), {
            onSuccess: () => navigate("/address-reseller"),
        });
    };

    return (
        <Box sx={{ display: "flex" }}>
            <NavMenu />

            <Box sx={{ ml: "240px", p: 3 }}>
                <Typography variant="h5" fontWeight={700} mb={2}>
                    Delete Reseller
                </Typography>

                <Typography mb={3}>
                    Are you sure you want to delete this reseller?
                </Typography>

                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() => navigate("/address-reseller")}
                    >
                        Cancel
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
}
