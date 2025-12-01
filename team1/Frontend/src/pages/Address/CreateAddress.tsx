import { useState } from "react";
import {
    Card,
    TextField,
    Typography,
    Button,
} from "@mui/material";
import { AddressApi } from "../../api/address.api";

const cardStyle = {
    background: "white",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 25px rgba(0,0,0,0.08)",
    maxWidth: 600,
    margin: "0 auto",
};

export default function CreateAddress() {
    const [zipCode, setZipCode] = useState("");
    const [houseNumber, setHouseNumber] = useState("");
    const [extension, setExtension] = useState("");

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        await AddressApi.create({ zipCode, houseNumber, extension });
        alert("Address created!");
        window.location.href = "/address/list";
    };

    return (
        <Card sx={cardStyle}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
                ➕ Add New Address
            </Typography>

            <form onSubmit={submit}>
                <TextField
                    fullWidth
                    label="Zip Code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <TextField
                    fullWidth
                    label="House Number"
                    value={houseNumber}
                    onChange={(e) => setHouseNumber(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <TextField
                    fullWidth
                    label="Extension"
                    value={extension}
                    onChange={(e) => setExtension(e.target.value)}
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
