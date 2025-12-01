import { Box, Button, Card, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useNavigate, useParams } from "react-router-dom";

export default function ResellerDelete() {
    const navigate = useNavigate();
    const { id } = useParams();

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#f8fafc",
                p: 4,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Card sx={{ width: "100%", maxWidth: 520, p: 0, overflow: "visible" }}>

                {/* HEADER */}
                <Box
                    sx={{
                        p: 3,
                        borderBottom: "1px solid #f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    <IconButton
                        onClick={() => navigate("/resellers")}
                        size="small"
                        sx={{ border: "1px solid #e2e8f0" }}
                    >
                        <ArrowBackIcon fontSize="small" />
                    </IconButton>

                    <Typography variant="h6" fontWeight={700}>
                        Delete Reseller
                    </Typography>
                </Box>

                {/* BODY */}
                <Box sx={{ p: 4, textAlign: "center" }}>
                    <WarningAmberRoundedIcon
                        sx={{ fontSize: 60, color: "#f59e0b", mb: 2 }}
                    />

                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        Are you sure you want to delete this reseller?
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        This action cannot be undone.
                        You are deleting reseller with ID: <b>{id}</b>.
                    </Typography>
                </Box>

                {/* FOOTER */}
                <Box
                    sx={{
                        p: 3,
                        bgcolor: "#f8fafc",
                        borderTop: "1px solid #f1f5f9",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={() => navigate("/resellers")}
                        sx={{ borderColor: "#cbd5e1", color: "#64748b" }}
                    >
                        Cancel
                    </Button>

                    <Button variant="contained" color="error">
                        Delete
                    </Button>
                </Box>
            </Card>
        </Box>
    );
}
