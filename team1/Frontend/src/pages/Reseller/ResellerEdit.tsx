import {
    Box, Button, Card, FormControl, FormLabel,
    Grid, IconButton, MenuItem, Select, TextField, Typography
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useState } from "react";
import { ResellerApi } from "@/services/customerService/ResellerService";

export default function ResellerEdit() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [form, setForm] = useState({
        name: "",
        type: "",
    });

    useEffect(() => {
        ResellerApi.getById(id!).then((data) => {
            setForm({
                name: data.name,
                type: data.type,
            });
        });
    }, [id]);

    const handleSave = async () => {
        await ResellerApi.update(id!, form);
        alert("Reseller updated!");
        navigate("/resellers");
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", p: 4, display: "flex", justifyContent: "center" }}>
            <Card sx={{ width: "100%", maxWidth: 800 }}>

                <Box sx={{
                    p: 4, borderBottom: "1px solid #f1f5f9",
                    display: "flex", alignItems: "center", gap: 2
                }}>
                    <IconButton onClick={() => navigate("/resellers")} size="small" sx={{ border: "1px solid #e2e8f0" }}>
                        <ArrowBackIcon fontSize="small" />
                    </IconButton>

                    <Typography variant="h5" fontWeight={700}>Edit Reseller</Typography>
                </Box>

                <Box sx={{ p: 4 }}>
                    <Grid container spacing={4}>
                        <Grid xs={12} md={6}>
                            <FormLabel>Reseller Name</FormLabel>
                            <TextField fullWidth value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        </Grid>

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
                    </Grid>
                </Box>

                <Box sx={{
                    p: 3, bgcolor: "#f8fafc", borderTop: "1px solid #f1f5f9",
                    display: "flex", justifyContent: "flex-end", gap: 2
                }}>
                    <Button variant="outlined" onClick={() => navigate("/resellers")}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save Changes</Button>
                </Box>

            </Card>
        </Box>
    );
}
