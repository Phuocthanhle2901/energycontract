import { useState } from "react";
import {
    Card,
    TextField,
    Typography,
    Button,
} from "@mui/material";
import { ResellerApi } from "../../api/reseller.api";

const cardStyle = {
    background: "white",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 25px rgba(0,0,0,0.08)",
    maxWidth: 600,
    margin: "0 auto",
};

export default function CreateReseller() {
    const [name, setName] = useState("");
    const [type, setType] = useState("");

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        await ResellerApi.create({ name, type });
        alert("Reseller created!");
        window.location.href = "/reseller/list";
    };

    return (
        <Card sx={cardStyle}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
                ➕ Add New Reseller
            </Typography>

            <form onSubmit={submit}>
                <TextField
                    fullWidth
                    label="Reseller Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <TextField
                    fullWidth
                    label="Type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                        mt: 2,
                        py: 1.4,
                        fontWeight: 600,
                        borderRadius: "12px",
                        background: "linear-gradient(90deg,#3550ff,#4f6bff)",
                    }}
                >
                    Create
                </Button>
            </form>
        </Card>
    );
}
