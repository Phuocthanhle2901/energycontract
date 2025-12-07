import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
} from "@mui/material";

import NavMenu from "@/components/NavMenu/NavMenu";
import { useNavigate } from "react-router-dom";
import { useAddressForm } from "@/hooks/useAddressForm";

export default function AddressCreate() {

    const navigate = useNavigate();

    const {
        form,
        handleChange,
        handleSubmit,
        loading
    } = useAddressForm(undefined);

    const onSubmit = () => {
        handleSubmit(() => navigate("/address-reseller"));
    };

    return (
        <Box sx={{ display: "flex" }}>
            <NavMenu />

            <Box sx={{ ml: "240px", p: 4, width: "100%" }}>
                <Paper sx={{ maxWidth: 600, mx: "auto", p: 4 }}>
                    <Typography variant="h4" fontWeight={700} mb={3}>
                        Create Address
                    </Typography>

                    <Stack spacing={2}>
                        <TextField
                            label="Zipcode"
                            name="zipCode"
                            value={form.zipCode}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextField
                            label="House Number"
                            name="houseNumber"
                            value={form.houseNumber}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextField
                            label="Extension"
                            name="extension"
                            value={form.extension}
                            onChange={handleChange}
                            fullWidth
                        />

                        <Button
                            variant="contained"
                            onClick={onSubmit}
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create"}
                        </Button>

                        <Button variant="outlined" onClick={() => navigate("/address-reseller")}>
                            Cancel
                        </Button>
                    </Stack>
                </Paper>
            </Box>
        </Box>
    );
}
