import { useEffect, useState } from "react";
import { Box, Paper, TextField, Typography, Button } from "@mui/material";
import { ResellerApi } from "../../api/reseller.api";
import { useParams, useNavigate } from "react-router-dom";

export default function ResellerEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [type, setType] = useState("");

    useEffect(() => {
        ResellerApi.getById(Number(id)).then((r) => {
            setName(r.name);
            setType(r.type);
        });
    }, [id]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        await ResellerApi.update(Number(id), { name, type });
        navigate("/resellers");
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <Paper
                sx={{
                    width: 600,
                    p: 4,
                    borderRadius: 4,
                    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                }}
            >
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
                    Edit Reseller
                </Typography>

                <form onSubmit={submit}>
                    <TextField
                        fullWidth
                        label="Reseller Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        fullWidth
                        label="Type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            py: 1.5,
                            fontSize: "1rem",
                            background: "#1e40af",
                            "&:hover": { background: "#1e3a8a" },
                        }}
                    >
                        Save Changes
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}
