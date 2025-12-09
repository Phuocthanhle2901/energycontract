import {
    Box,
    Paper,
    Typography,
    Button
} from "@mui/material";

import NavMenu from "@/components/NavMenu/NavMenu";
import { useNavigate, useParams } from "react-router-dom";
import { AddressApi } from "@/api/address.api";
import { useState } from "react";

export default function AddressDelete() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);

    const onDelete = async () => {
        try {
            setLoading(true);
            await AddressApi.delete(Number(id));
            navigate("/address-reseller");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: "flex" }}>
            <NavMenu />

            <Box sx={{ ml: "240px", p: 4, width: "100%" }}>
                <Paper sx={{ maxWidth: 600, mx: "auto", p: 4, textAlign: "center" }}>
                    <Typography variant="h5" fontWeight={700} mb={2}>
                        Delete Address
                    </Typography>

                    <Typography color="error" mb={3}>
                        Are you sure you want to delete this address?
                    </Typography>

                    <Button
                        variant="contained"
                        color="error"
                        onClick={onDelete}
                        disabled={loading}
                        sx={{ mr: 2 }}
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() => navigate("/address-reseller")}
                    >
                        Cancel
                    </Button>
                </Paper>
            </Box>
        </Box>
    );
}
