import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    MenuItem
} from "@mui/material";

import NavMenu from "@/components/NavMenu/NavMenu";
import { useNavigate } from "react-router-dom";
import { useResellerForm } from "@/hooks/useResellerForm";

export default function ResellerCreate() {

    const navigate = useNavigate();

    // ✅ Create mode → KHÔNG truyền id
    const {
        form,
        handleChange,
        handleSubmit,
        loading
    } = useResellerForm(undefined);

    const onSubmit = () => {
        handleSubmit(() => navigate("/address-reseller"));
    };

    return (
        <Box sx={{ display: "flex" }}>
            <NavMenu />

            <Box sx={{ ml: "240px", p: 4, width: "100%" }}>
                <Paper sx={{ maxWidth: 600, mx: "auto", p: 4 }}>
                    <Typography variant="h4" fontWeight={700} mb={3}>
                        Create Reseller
                    </Typography>

                    <Stack spacing={2}>
                        <TextField
                            label="Name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextField
                            label="Type"
                            name="type"
                            select
                            value={form.type}
                            onChange={handleChange}
                            fullWidth
                        >
                            <MenuItem value="Broker">Broker</MenuItem>
                            <MenuItem value="Agency">Agency</MenuItem>
                        </TextField>

                        <Button
                            variant="contained"
                            onClick={onSubmit}
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create"}
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={() => navigate("/address-reseller")}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Paper>
            </Box>
        </Box>
    );
}
