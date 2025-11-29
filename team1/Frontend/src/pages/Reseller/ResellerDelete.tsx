import { Box, Paper, Typography, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { ResellerApi } from "../../api/reseller.api";

export default function ResellerDelete() {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleDelete = async () => {
        await ResellerApi.delete(Number(id));
        navigate("/resellers");
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <Paper
                sx={{
                    width: 500,
                    p: 4,
                    textAlign: "center",
                    borderRadius: 4,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                    Delete Reseller?
                </Typography>

                <Typography sx={{ mb: 4, color: "gray" }}>
                    This action cannot be undone.
                </Typography>

                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            background: "#dc2626",
                            "&:hover": { background: "#b91c1c" },
                        }}
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>

                    <Button fullWidth variant="outlined" onClick={() => navigate("/resellers")}>
                        Cancel
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
