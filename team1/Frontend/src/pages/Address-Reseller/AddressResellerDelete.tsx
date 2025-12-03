import { Box, Button, Card, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { AddressApi } from "../../api/address.api";
import { ResellerApi } from "../../api/reseller.api";

export default function AddressResellerDelete() {
    const { type, id } = useParams();
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (type === "address") await AddressApi.delete(Number(id));
        else await ResellerApi.delete(Number(id));

        alert("Deleted!");
        navigate("/address-reseller/list");
    };

    return (
        <Box sx={{ p: 4, maxWidth: 500, mx: "auto" }}>
            <Card sx={{ p: 4, textAlign: "center", borderRadius: 4, boxShadow: "0 8px 30px rgba(0,0,0,0.05)" }}>
                <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
                    Delete {type}?
                </Typography>

                <Typography sx={{ mb: 3, color: "#64748b" }}>
                    This action cannot be undone.
                </Typography>

                <Button
                    variant="contained"
                    fullWidth
                    color="error"
                    sx={{ textTransform: "none", fontWeight: 600, mb: 2 }}
                    onClick={handleDelete}
                >
                    Yes, Delete
                </Button>

                <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate("/address-reseller/list")}
                >
                    Cancel
                </Button>
            </Card>
        </Box>
    );
}
