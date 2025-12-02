import {
    Box, Button, Card, FormControl, FormLabel,
    Grid, IconButton, MenuItem, Select, TextField, Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavMenu from "@/components/NavMenu/NavMenu";
import { useState } from "react";
import { ResellerApi } from "../../api/reseller.api";

export default function CreateReseller() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        type: "Broker",
        email: "",
        phone: "",
    });

    const handleCreate = async () => {
        await ResellerApi.create({
            name: form.name,
            type: form.type
        });

        alert("Reseller created successfully!");
        navigate("/resellers");
    };


    return (
        <>
            <NavMenu />
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
                                Create New Reseller
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Fill in the details below to add a new partner.
                            </Typography>
                        </Box>
                    </Box>

                    {/* BODY */}
                    <Box sx={{ p: 4 }}>
                        <Grid container spacing={4}>

                            {/* SECTION TITLE */}


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
                                <FormLabel>Email Address</FormLabel>
                                <TextField
                                    fullWidth
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                            </Grid>

                            {/* PHONE */}
                            <Grid xs={12} md={6}>
                                <FormLabel>Phone Number</FormLabel>
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

                        <Button variant="contained" onClick={handleCreate}>
                            Create Reseller
                        </Button>
                    </Box>
                </Card>
            </Box>
        </>
    );
}
