import {
    Box, Button, Card, FormControl, FormLabel,
    Grid, IconButton, MenuItem, Select, TextField, Typography
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useState } from "react";
import { ResellerApi } from "../../api/reseller.api";

export default function ResellerEdit() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [form, setForm] = useState({
        name: "",
        type: "",
        email: "",
        phone: "",
    });

    useEffect(() => {
        ResellerApi.getById(id).then((data) => {
            setForm({
                name: data.name || "",
                type: data.type || "",
                email: "",
                phone: "",
            });

        });
    }, [id]);

    const handleSave = async () => {
        await ResellerApi.update(id, {
            name: form.name,
            type: form.type
        });

        alert("Reseller updated!");
        navigate("/resellers");
    };


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

                        {/* NAME */}
                        <Grid xs={12} md={6}>
                            <FormLabel>Reseller Name</FormLabel>
                            <TextField
                                fullWidth
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                        </Grid>

                        {/* TYPE */}
                        <Grid xs={12} md={6}>
                            <FormLabel>Partner Type</FormLabel>
                            <FormControl fullWidth>
                                <Select
                                    value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                >
                                    <MenuItem value="Broker">Broker</MenuItem>
                                    <MenuItem value="Agency">Agency</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* EMAIL */}
                        <Grid xs={12} md={6}>
                            <FormLabel>Email</FormLabel>
                            <TextField
                                fullWidth
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </Grid>

                        {/* PHONE */}
                        <Grid xs={12} md={6}>
                            <FormLabel>Phone</FormLabel>
                            <TextField
                                fullWidth
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            />
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

                    <Button variant="contained" onClick={handleSave}>Save Changes</Button>
                </Box>
            </Card>
        </Box>
    );
}
