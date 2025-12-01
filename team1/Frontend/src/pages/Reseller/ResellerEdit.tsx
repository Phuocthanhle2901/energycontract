import {
    Box, Button, Card, FormControl, FormLabel,
    Grid, IconButton, MenuItem, Select, TextField, Typography
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ResellerEdit() {
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
                alignItems: "flex-start",
            }}
        >
            <Card sx={{ width: "100%", maxWidth: 800, overflow: "visible" }}>

                {/* HEADER */}
                <Box
                    sx={{
                        p: 4,
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

                    <Box>
                        <Typography variant="h5" fontWeight={700}>
                            Edit Reseller
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Editing reseller ID: <b>{id}</b>
                        </Typography>
                    </Box>
                </Box>

                {/* BODY */}
                <Box sx={{ p: 4 }}>
                    <Grid container spacing={4}>

                        {/* SECTION TITLE */}
                        <Grid size={{ xs: 12 }}>
                            <Box sx={{ borderBottom: "1px solid #e2e8f0", pb: 1, mb: 3 }}>
                                <Typography
                                    sx={{
                                        color: "#3b82f6",
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        fontSize: "0.8rem",
                                    }}
                                >
                                    Partner Information
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormLabel>Reseller Name</FormLabel>
                            <TextField defaultValue="Current reseller name" fullWidth />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormLabel>Partner Type</FormLabel>
                            <FormControl fullWidth>
                                <Select defaultValue="Broker">
                                    <MenuItem value="Broker">Broker</MenuItem>
                                    <MenuItem value="Agency">Agency</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormLabel>Commission Rate (%)</FormLabel>
                            <TextField defaultValue="10.0" fullWidth />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box sx={{ borderBottom: "1px solid #e2e8f0", pb: 1, mb: 3 }}>
                                <Typography
                                    sx={{
                                        color: "#3b82f6",
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        fontSize: "0.8rem",
                                    }}
                                >
                                    Contact Details
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormLabel>Email Address</FormLabel>
                            <TextField defaultValue="contact@company.com" fullWidth />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormLabel>Phone Number</FormLabel>
                            <TextField defaultValue="+1 (555) 123-4567" fullWidth />
                        </Grid>

                    </Grid>
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

                    <Button variant="contained">Save Changes</Button>
                </Box>
            </Card>
        </Box>
    );
}
